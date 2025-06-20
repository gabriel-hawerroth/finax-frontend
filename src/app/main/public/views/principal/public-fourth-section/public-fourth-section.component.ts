import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-fourth-section',
  imports: [MatListModule, MatButtonModule, RouterModule],
  templateUrl: './public-fourth-section.component.html',
  styleUrl: './public-fourth-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFourthSectionComponent {}
