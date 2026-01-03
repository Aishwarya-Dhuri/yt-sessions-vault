import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalConstants } from '../constants/global.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
  if (localData != null) {
    return true
  } else {
    router.navigateByUrl('/login')
  }

  return false

};
