import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBackButton]',
  standalone: true,
})
export class BackButtonDirective {
  constructor(private readonly _location: Location) {}

  @HostListener('click')
  onClick(): void {
    this._location.back();
  }
}
