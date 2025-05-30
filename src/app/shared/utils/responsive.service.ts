import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private readonly small = '(max-width: 650px)';
  private readonly medium = '(min-width: 651px) and (max-width: 1050px)';
  private readonly large = '(min-width: 1051px) and (max-width: 1400px)';
  private readonly veryLarge = '(min-width: 1401px)';

  breakpointObserver = inject(BreakpointObserver);

  screenWith = toSignal(
    this.breakpointObserver.observe([
      this.small,
      this.medium,
      this.large,
      this.veryLarge,
    ])
  );

  smallWidth = computed(
    () => this.screenWith()?.breakpoints[this.small] || false
  );
  mediumWidth = computed(
    () => this.screenWith()?.breakpoints[this.medium] || false
  );
  largeWidth = computed(
    () => this.screenWith()?.breakpoints[this.large] || false
  );
  veryLargeWith = computed(
    () => this.screenWith()?.breakpoints[this.veryLarge] || false
  );

  isMobileView = computed(
    () => this.smallWidth() || this.mediumWidth() || false
  );
}

export function getResponsiveDialogWidth(defaultWidth: string) {
  return (responsiveService: ResponsiveService) => {
    return responsiveService.smallWidth()
      ? '100vw'
      : responsiveService.mediumWidth()
      ? '75vw'
      : defaultWidth;
  };
}
