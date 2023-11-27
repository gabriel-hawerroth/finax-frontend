import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
})
export class CashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {}
}
