import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-cash-flow-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cash-flow-reports.component.html',
  styleUrl: './cash-flow-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowReportsPage implements OnInit {
  constructor(public readonly utils: UtilsService) {}

  ngOnInit(): void {}
}
