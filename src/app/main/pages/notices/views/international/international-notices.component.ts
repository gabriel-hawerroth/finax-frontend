import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-international-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './international-notices.component.html',
  styleUrl: './international-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalNoticesPage implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
