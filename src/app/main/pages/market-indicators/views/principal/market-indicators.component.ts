import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-market-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-indicators.component.html',
  styleUrl: './market-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketIndicatorsPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
