import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-third-section',
  standalone: true,
  imports: [],
  templateUrl: './public-third-section.component.html',
  styleUrl: './public-third-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicThirdSectionComponent {

}
