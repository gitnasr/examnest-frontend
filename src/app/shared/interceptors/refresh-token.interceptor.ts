import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, BehaviorSubject, filter, take, switchMap, Observable, of, retry } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
const MAX_RETRIES = 1; // Maximum number of retries after token refresh

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('RefreshTokenInterceptor: Caught error:', error.status, req.url);
      
      // Don't handle auth errors for authentication endpoints
      const isAuthEndpoint = req.url.includes('/Authentication/login') || 
                           req.url.includes('/Authentication/register') || 
                           req.url.includes('/Authentication/refresh');
      
      if ((error.status === 401 || error.status === 403) && !isAuthEndpoint) {
        if (error.status === 403) {
          // For 403, first check if token is expired and can be refreshed
          const token = authService.getAccessToken();
          if (token && authService.isTokenExpired(token)) {
            console.log('RefreshTokenInterceptor: Token expired on 403, attempting refresh');
            return handleTokenRefresh(req, next, authService);
          } else {
            // If token is valid but still getting 403, it's a true authorization error
            console.log('RefreshTokenInterceptor: Valid token but 403 - true authorization error');
            return throwError(() => new Error('You do not have permission to access this resource'));
          }
        } else {
          // For 401, always try to refresh
          console.log('RefreshTokenInterceptor: Handling 401 for non-auth endpoint');
          return handleTokenRefresh(req, next, authService);
        }
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        console.log('RefreshTokenInterceptor: Token refresh successful');
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        
        // Retry the original request with the new token
        const newRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.accessToken}`
          }
        });
        
        // Retry the request with the new token
        return next(newRequest).pipe(
          retry(MAX_RETRIES) // Retry once if it fails
        );
      }),
      catchError((error) => {
        console.log('RefreshTokenInterceptor: Token refresh failed:', error);
        isRefreshing = false;
        refreshTokenSubject.next(null);
        authService.logout();
        return throwError(() => error);
      })
    );
  } else {
    // Wait for the ongoing refresh to complete
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        if (token) {
          console.log('RefreshTokenInterceptor: Using refreshed token for retry');
          const newRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next(newRequest).pipe(
            retry(MAX_RETRIES) // Retry once if it fails
          );
        } else {
          console.log('RefreshTokenInterceptor: Refresh failed, logging out');
          authService.logout();
          return throwError(() => new Error('Token refresh failed'));
        }
      })
    );
  }
} 