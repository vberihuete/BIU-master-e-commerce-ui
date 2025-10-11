import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone the request and add authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch any authentication errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // Token expired or unauthorized
        authService.logout();
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};

