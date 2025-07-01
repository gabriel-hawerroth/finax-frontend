import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-releases-by-category-card',
  imports: [CommonModule, TranslateModule, MatCardModule, ChartModule],
  templateUrl: './releases-by-category-card.component.html',
  styleUrl: './releases-by-category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCategoryCardComponent implements OnInit {
  theme = input.required<string>();
  currency = input.required<string>();
  chartData = input.required<ChartData>();

  cardTitle = input.required<string>();

  options!: ChartOptions;

  ngOnInit(): void {
    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: this.theme() === 'dark' ? '#e5e5e5' : '#000',
          },
        },
        tooltip: {
          callbacks: {
            label: (data) => {
              return ` ${this.currency()}${data.formattedValue}`;
            },
          },
        },
      },
    };
  }
}
