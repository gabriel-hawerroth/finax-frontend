import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../utils/utils.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'btn-content',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './btn-content.component.html',
  styleUrl: './btn-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnContentComponent {
  label = input.required<string>();
  icon = input.required<string>();

  readonly isPcScreen = this._utils.isPcScreen;

  constructor(private readonly _utils: UtilsService) {}
}
