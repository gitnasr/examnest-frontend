import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, BehaviorSubject, filter, take, switchMap, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('RefreshTokenInterceptor: Caught error:', error.status, req.url);
      
      // Don't handle 401 errors for authentication endpoints
      const isAuthEndpoint = req.url.includes('/Authentication/login') || 
                           req.url.includes('/Authentication/register') || 
                           req.url.includes('/Authentication/refresh');
      
      if (error.status === 401 && !isAuthEndpoint) {
        console.log('RefreshTokenInterceptor: Handling 401 for non-auth endpoint');
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<any> {
  console.log('RefreshTokenInterceptor: Starting token refresh');
  
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
        
        return next(newRequest);
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
    console.log('RefreshTokenInterceptor: Token refresh already in progress, waiting...');
    // Wait for the refresh to complete
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
          return next(newRequest);
        } else {
          // If token is null, refresh failed
          console.log('RefreshTokenInterceptor: Refresh failed, logging out');
          authService.logout();
          return throwError(() => new Error('Token refresh failed'));
        }
      })
    );
  }
} 