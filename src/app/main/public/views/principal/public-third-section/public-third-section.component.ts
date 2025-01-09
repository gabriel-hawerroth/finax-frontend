import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-third-section',
  imports: [ReactiveFormsModule, MatSlideToggle, MatButtonModule, RouterModule],
  templateUrl: './public-third-section.component.html',
  styleUrl: './public-third-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicThirdSectionComponent {
  switchPlansControl: FormControl = new FormControl(false);
}
