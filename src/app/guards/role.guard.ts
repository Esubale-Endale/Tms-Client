import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.hasRole(requiredRole)) {
      return true;
    }
    return router.createUrlTree(['/unauthorized']);
  };
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();

  console.log("from guest guard user :", user)
  if (!user) {
    return true;
  }
  return router.createUrlTree([`/${user.role.toLowerCase()}`]);
};
