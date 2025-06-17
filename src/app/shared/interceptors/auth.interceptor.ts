import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Don't add Authorization header if it's already present (e.g., from refresh token interceptor)
  if (req.headers.has('Authorization')) {
    console.log('AuthInterceptor: Authorization header already present, skipping');
    return next(req);
  }
  
  const token = authService.getAccessToken();
  
  if (token) {
    console.log('AuthInterceptor: Adding Authorization header with token');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('AuthInterceptor: No token available, proceeding without Authorization header');
  }
  
  return next(req);
}; 