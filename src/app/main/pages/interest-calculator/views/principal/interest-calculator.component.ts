import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-interest-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interest-calculator.component.html',
  styleUrl: './interest-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestCalculatorPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
