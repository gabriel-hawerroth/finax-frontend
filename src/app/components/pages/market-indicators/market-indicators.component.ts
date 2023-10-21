import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-market-indicators',
  templateUrl: './market-indicators.component.html',
  styleUrls: ['./market-indicators.component.scss'],
})
export class MarketIndicatorsComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
