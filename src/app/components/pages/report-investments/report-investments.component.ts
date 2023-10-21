import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-report-investments',
  templateUrl: './report-investments.component.html',
  styleUrls: ['./report-investments.component.scss'],
})
export class ReportInvestmentsComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
