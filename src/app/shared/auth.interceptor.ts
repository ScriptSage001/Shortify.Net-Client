import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './services/auth/auth.service';
import { AuthResponse } from './models/auth-response';
import { HttpErrorHandlerUtils } from './utils/http-error-handler.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const errorHandler = inject(HttpErrorHandlerUtils);

  if (authService.isLoggedIn()) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getAccessToken())
    });

    return next(clonedReq).pipe(
      catchError((err) => {        
        if (err.status === 401) {
          if (authService.canRefreshToken()) {

            // Using switchMap to handle refresh logic properly
            return authService.refreshToken().pipe(
              switchMap((res: AuthResponse) => {
                authService.saveToken(res);

                // Clonning the request with the new token
                const refreshedReq = req.clone({
                  headers: req.headers.set('Authorization', 'Bearer ' + res.accessToken)
                });

                // Retrying the original request with the new token
                return next(refreshedReq);
              }),
              catchError((refreshErr) => {
                // Handle refresh token error (e.g., if refresh fails)
                authService.removeToken();
                setTimeout(() => {
                  toastr.info('Please login again.', 'Session Expired!');
                }, 1000);
                router.navigateByUrl('sign-in');
                return throwError(() => refreshErr);
              })
            );
          } else {
            // No refresh token available, handle logout
            authService.removeToken();
            setTimeout(() => {
              toastr.info('Please login again.', 'Session Expired!');
            }, 1000);
            router.navigateByUrl('sign-in');
          }
        } else if (err.status === 403) {
          toastr.error("Oops! It seems you're not authorized to perform the action.");
        }

        // Re-throw the error for further handling if needed
        return throwError(() => err);
      })
    );
  }

  // If the user is not logged in, proceed without adding an Authorization header
  return next(req).pipe(
    catchError((err) => {
      // Handle the errors using Common Error Handler Utility
      errorHandler.handleError(err);

      // Re-throw the error for further handling if needed
      return throwError(() => err);
    })
  );
};