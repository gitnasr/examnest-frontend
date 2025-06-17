import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import Material from '@primeng/themes/material';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './shared/interceptors/refresh-token.interceptor';
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([refreshTokenInterceptor, authInterceptor])
    ),
    providePrimeNG({
        theme: {
            preset: Material
        }
    }),
    CookieService
  ]
};
