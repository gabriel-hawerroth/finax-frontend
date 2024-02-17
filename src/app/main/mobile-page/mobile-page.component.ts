import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicHeaderComponent } from '../public-header/public-header.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';

@Component({
  selector: 'app-mobile-page',
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './mobile-page.component.html',
  styleUrl: './mobile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePageComponent {}
