import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const notPwaGuard: CanActivateFn = (
  route,
  state,
  platformId = inject(PLATFORM_ID),
  router = inject(Router),
) => {
  if (isPlatformServer(platformId)) return false;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;

  if (isStandalone) router.navigateByUrl('login');

  return !isStandalone;
};
