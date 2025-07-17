import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ResponsiveService } from '../../shared/services/responsive.service';

export const webGuard: CanActivateFn = (
  route,
  state,
  responsiveService = inject(ResponsiveService)
) => {
  return !responsiveService.isMobileView();
};
