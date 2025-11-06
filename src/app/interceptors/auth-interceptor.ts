import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const headers: any = { 'Content-Type': 'application/json' };
  //Solo añadimos token si hay
  if (token) {
    headers['Authorization'] = token;
  }
  const clonedRequest = req.clone({ setHeaders: headers });
  return next(clonedRequest);
};
