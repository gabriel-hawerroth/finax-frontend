import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-report-investments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-investments.component.html',
  styleUrl: './report-investments.component.scss',
})
export class ReportInvestmentsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {}
}
