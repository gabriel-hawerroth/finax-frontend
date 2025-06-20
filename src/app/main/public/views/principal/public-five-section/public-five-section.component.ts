import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-five-section',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './public-five-section.component.html',
  styleUrl: './public-five-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFiveSectionComponent {}
