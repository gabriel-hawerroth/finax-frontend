import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-market-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-indicators.component.html',
  styleUrl: './market-indicators.component.scss',
})
export class MarketIndicatorsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
