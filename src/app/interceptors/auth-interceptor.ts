// src/app/interceptors/auth-interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(MatSnackBar) as MatSnackBar;;

  // Añadir token si existe
  const token = localStorage.getItem('token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado';

      if (error.error?.message) {
        message = error.error.message; // mensaje del backend
      } else if (error.status === 0) {
        message = 'No hay conexión con el servidor';
      } else {
        message = `Error ${error.status}: ${error.statusText}`;
      }

      // Mostrar snackbar en pantalla
      snackbar.open(message, 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar'], // opcional: clase CSS para estilo
      });

      return throwError(() => ({ message }));
    })
  );
};
