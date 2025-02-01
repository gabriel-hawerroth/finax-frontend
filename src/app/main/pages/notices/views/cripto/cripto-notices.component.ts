import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-cripto-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cripto-notices.component.html',
  styleUrl: './cripto-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriptoNoticesPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
