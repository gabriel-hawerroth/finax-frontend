import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { getBtnStyle } from '../../../../shared/utils/constant-utils';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cancelation-error',
  standalone: true,
  imports: [ButtonsComponent, RouterModule, MatCardModule, TranslateModule],
  templateUrl: './cancelation-error.component.html',
  styleUrl: './cancelation-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelationErrorPage {
  getBtnStyle = getBtnStyle;
}
