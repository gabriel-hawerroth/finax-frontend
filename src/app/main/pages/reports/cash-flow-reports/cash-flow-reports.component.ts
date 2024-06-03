import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-cash-flow-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cash-flow-reports.component.html',
  styleUrl: './cash-flow-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowReportsPage implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
