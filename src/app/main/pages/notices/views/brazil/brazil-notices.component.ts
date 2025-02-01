import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-brazil-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brazil-notices.component.html',
  styleUrl: './brazil-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrazilNoticesPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
