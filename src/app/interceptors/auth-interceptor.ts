import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders:{
      'Content-type':'application/json',
      'Authorization':localStorage.getItem('token')||""
    }
  })
  return next(req);
};
