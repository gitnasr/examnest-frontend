import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth endpoints
  if (req.url.includes('/Authentication/')) {
    return next(req);
  }
  
  // Don't add Authorization header if it's already present
  if (req.headers.has('Authorization')) {
    return next(req);
  }
  
  const token = authService.getAccessToken();
  
  if (token) {
    // Check if token is expired or will expire soon
    if (authService.isTokenExpired(token, true)) { // Use buffer time for proactive refresh
      // Let the refresh token interceptor handle this
      return next(req);
    }
    
    // Add token to request
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
}; 