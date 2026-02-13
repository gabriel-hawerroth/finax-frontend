import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { PublicFooterComponent } from '../../components/footer/public-footer.component';
import { PublicHeaderComponent } from '../../components/header/public-header.component';
import { PublicFirstSectionComponent } from './public-first-section/public-first-section.component';
import { PublicFiveSectionComponent } from './public-five-section/public-five-section.component';
import { PublicFourthSectionComponent } from './public-fourth-section/public-fourth-section.component';
import { PublicSecondSectionComponent } from './public-second-section/public-second-section.component';
import { PublicThirdSectionComponent } from './public-third-section/public-third-section.component';

@Component({
  selector: 'app-public',
  imports: [
    PublicHeaderComponent,
    PublicFirstSectionComponent,
    PublicSecondSectionComponent,
    PublicThirdSectionComponent,
    PublicFourthSectionComponent,
    PublicFiveSectionComponent,
    PublicFooterComponent,
    MatDividerModule,
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicPage {
  navigateToResources() {
    const element = document.getElementById('third-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToPrices() {
    const element = document.getElementById('fourth-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
