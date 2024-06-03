import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-market-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-indicators.component.html',
  styleUrl: './market-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketIndicatorsPage implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
