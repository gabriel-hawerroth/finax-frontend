import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'privacy-policy-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPage {
  readonly darkThemeEnabled = signal(
    this._utilsService.getUserConfigs.theme === 'dark'
  );

  constructor(private readonly _utilsService: UtilsService) {}
}
