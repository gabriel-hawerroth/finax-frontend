import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { getBtnStyle } from '../../../../shared/utils/utils';

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
