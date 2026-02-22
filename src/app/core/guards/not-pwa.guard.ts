import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const notPwaGuard: CanActivateFn = (
  route,
  state,
  platformId = inject(PLATFORM_ID),
) => {
  if (isPlatformServer(platformId)) return false;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;

  return !isStandalone;
};
