import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          // Check if token is expired (without buffer)
          const token = this.authService.getAccessToken();
          if (token && this.authService.isTokenExpired(token, false)) {
            // Token is expired, try to refresh
            return this.authService.refreshToken().pipe(
              map(() => true),
              catchError(() => {
                this.router.navigate(['/auth']);
                return of(false);
              })
            );
          }
          return of(true);
        } else {
          this.router.navigate(['/auth']);
          return of(false);
        }
      })
    );
  }
} 