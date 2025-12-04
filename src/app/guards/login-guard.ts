import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  let token = localStorage.getItem('token')||null;

  if (!token || token.trim() === '') {
    return router.parseUrl('/login');
  }
  return true;
};
