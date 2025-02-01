import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-investment-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investment-reports.component.html',
  styleUrl: './investment-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentReportsPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
