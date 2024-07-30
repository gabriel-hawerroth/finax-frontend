import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-second-section',
  standalone: true,
  imports: [],
  templateUrl: './public-second-section.component.html',
  styleUrl: './public-second-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicSecondSectionComponent {

}
