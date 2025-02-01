import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-spending-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-goals.component.html',
  styleUrl: './spending-goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpendingGoalsComponent implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {}
}
