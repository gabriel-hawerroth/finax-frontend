import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-report-cash-flow',
  templateUrl: './report-cash-flow.component.html',
  styleUrls: ['./report-cash-flow.component.scss'],
})
export class ReportCashFlowComponent implements OnInit {
  language = '';

  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {
    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value.language;
    });
  }
}
