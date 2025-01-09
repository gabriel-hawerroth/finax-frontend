import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-profile-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-profile-form.component.html',
  styleUrl: './my-profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileFormComponent {
  userForm = input.required<FormGroup>();
}
