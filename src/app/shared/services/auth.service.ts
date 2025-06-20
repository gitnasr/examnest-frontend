import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { 
  AuthenticationDTO, 
  RegisterDTO, 
  RefreshTokenDTO, 
  ApiResponse,
  Roles
} from '../interfaces/api.interface';
import { ApiService } from './api.service';

// Auth-specific interfaces that extend the base ones
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: Roles;
  branchId?: number;
  trackId?: number;
}

export interface TokenPayload {
  jti: string;
  unique_name: string;
  nameid: string;
  email: string;
  name?: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  sub?: string; // Optional for backward compatibility
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  private readonly currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(credentials: AuthenticationDTO): Observable<AuthResponse> {
    return this.apiService.post<ApiResponse<AuthResponse>>('/Authentication/login', credentials)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            const error = new Error(response?.errors?.[0] ?? response?.message ?? 'Login failed');
            (error as any).error = {
              success: false,
              data: null,
              errors: response?.errors || [response?.message || 'Login failed'],
              message: response?.message || 'Login failed'
            };
            throw error;
          }
          return response.data;
        }),
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          const userInfo = this.decodeToken(response.accessToken);
          this.currentUserSubject.next(userInfo);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterDTO): Observable<AuthResponse> {
    return this.apiService.post<ApiResponse<AuthResponse>>('/Authentication/register', userData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            const error = new Error(response?.errors?.[0] ?? response?.message ?? 'Registration failed');
            (error as any).error = {
              success: false,
              data: null,
              errors: response?.errors || [response?.message || 'Registration failed'],
              message: response?.message || 'Registration failed'
            };
            throw error;
          }
          return response.data;
        }),
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          const userInfo = this.decodeToken(response.accessToken);
          this.currentUserSubject.next(userInfo);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<AuthResponse> {
    console.log('AuthService: Starting token refresh');
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();
    
    console.log('AuthService: Refresh token exists:', !!refreshToken);
    console.log('AuthService: Access token exists:', !!accessToken);
    
    if (!refreshToken || !accessToken) {
      console.log('AuthService: No refresh token or access token available');
      return throwError(() => new Error('No refresh token available'));
    }

    const refreshData: RefreshTokenDTO = {
      refreshToken,
      accessToken
    };

    console.log('AuthService: Making refresh token request');
    return this.apiService.post<ApiResponse<AuthResponse>>('/Authentication/refresh', refreshData)
      .pipe(
        map(response => {
          console.log('AuthService: Refresh response received:', response);
          if (!response.success || !response.data) {
            console.log('AuthService: Refresh failed - no success or data');
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Token refresh failed');
          }
          return response.data;
        }),
        tap(response => {
          console.log('AuthService: Setting new tokens');
          this.setTokens(response.accessToken, response.refreshToken);
          // Decode the token to get user info including role
          const userInfo = this.decodeToken(response.accessToken);
          userInfo.id = "22"
          this.currentUserSubject.next(userInfo);
          this.isAuthenticatedSubject.next(true);
          console.log('AuthService: Token refresh completed successfully');
        }),
        catchError(error => {
          console.log('AuthService: Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<UserInfo> {
    return this.apiService.get<ApiResponse<UserInfo>>('/Authentication/me')
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response?.errors?.[0] ?? response?.message ?? 'Failed to get user info');
          }
          return response.data;
        }),
        tap(user => {
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY);
    this.cookieService.delete(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth']);
  }

  getCurrentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: Roles): boolean {
    const user = this.getCurrentUserValue();
    return user ? user.role >= role : false;
  }

  hasAnyRole(roles: Roles[]): boolean {
    const user = this.getCurrentUserValue();
    return user ? roles.includes(user.role) : false;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    // Set access token to expire in 1 hour
    const accessTokenExpiry = new Date();
    accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1);
    
    // Set refresh token to expire in 7 days
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    
    // Set access token cookie with improved settings
    this.cookieService.set(
      this.ACCESS_TOKEN_KEY, 
      accessToken, 
      {
        expires: accessTokenExpiry,
        path: '/',
        secure: true,
        sameSite: 'Strict'
      }
    );
    
    // Set refresh token cookie with improved settings
    this.cookieService.set(
      this.REFRESH_TOKEN_KEY, 
      refreshToken, 
      {
        expires: refreshTokenExpiry,
        path: '/',
        secure: true,
        sameSite: 'Strict'
      }
    );
  }

  getAccessToken(): string | null {
    const token = this.cookieService.get(this.ACCESS_TOKEN_KEY);
    return token || null;
  }

  getRefreshToken(): string | null {
    const token = this.cookieService.get(this.REFRESH_TOKEN_KEY);
    return token || null;
  }

  isTokenExpired(token: string, useBuffer: boolean = false): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      // Only apply buffer time when explicitly requested (for proactive refresh)
      const bufferTime = useBuffer ? 5 * 60 : 0; // 5 minutes buffer only when useBuffer is true
      const isExpired = decoded.exp < (currentTime + bufferTime);
      
      console.log('AuthService: Token expiration check:', {
        tokenExpiry: new Date(decoded.exp * 1000),
        currentTime: new Date(currentTime * 1000),
        bufferTimeApplied: bufferTime,
        isExpired: isExpired
      });
      
      return isExpired;
    } catch (error) {
      console.log('AuthService: Error checking token expiration:', error);
      return true;
    }
  }

  private decodeToken(token: string): UserInfo {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Map the role string from JWT to UserRole enum
      let role: Roles;
      switch (decoded.role?.toLowerCase()) {
        case 'student':
          role = Roles.Student;
          break;
        case 'instructor':
          role = Roles.Instructor;
          break;
        case 'admin':
          role = Roles.Admin;
          break;
        case 'superadmin':
          role = Roles.SuperAdmin;
          break;
        default:
          role = Roles.Student; // Default to student if role is not recognized
      }
      
      return {
        id: decoded.nameid || decoded.sub || '',
        email: decoded.email || decoded.unique_name || '',
        name: decoded.name || '',
        role: role
      };
    } catch {
      throw new Error('Invalid token');
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors && error.error.errors.length > 0) {
      errorMessage = error.error.errors[0];
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 