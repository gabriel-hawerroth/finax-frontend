import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicFooterComponent } from '../public/components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../public/components/public-header/public-header.component';

@Component({
  selector: 'app-mobile-page',
  standalone: true,
  imports: [PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './mobile-page.component.html',
  styleUrl: './mobile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePage {}
