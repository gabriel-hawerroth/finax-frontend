import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-public-five-section',
  imports: [MatButtonModule],
  templateUrl: './public-five-section.component.html',
  styleUrl: './public-five-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFiveSectionComponent {}
