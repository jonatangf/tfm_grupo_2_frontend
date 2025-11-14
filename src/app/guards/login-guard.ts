import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  console.log('guarda');
  
  let token = localStorage.getItem('token')||null;

  console.log(token);
  if (!token) {
    return router.parseUrl('/login');
  }
  return true;
};
