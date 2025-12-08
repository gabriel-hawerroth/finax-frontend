
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { ResponsiveService } from '../../../../../shared/services/responsive.service';

@Component({
  selector: 'app-releases-by-card',
  imports: [
    TranslateModule,
    MatCardModule,
    ChartModule,
    MatProgressSpinnerModule
],
  templateUrl: './releases-by-card.component.html',
  styleUrl: './releases-by-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCardComponent {
  theme = input.required<string>();
  currency = input.required<string>();
  cardTitle = input.required<string>();

  completedInitialFetch = input.required<boolean>();
  searching = input.required<boolean>();
  error = input.required<boolean>();

  chartType = input.required<'pie' | 'bar'>();
  chartData = input.required<ChartData>();

  cardHeight = computed(() => {
    if (this._responsiveService.isMobileView()) {
      return this.chartType() === 'pie' ? '34rem' : '20rem';
    }

    return '30rem';
  });

  options = computed<ChartOptions>(() => {
    const baseOptions: ChartOptions = {
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

    if (this.chartType() === 'bar') {
      return {
        ...baseOptions,
        responsive: true,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins?.legend,
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: this.theme() === 'dark' ? '#e5e5e5' : '#000',
            },
            grid: {
              color: this.theme() === 'dark' ? '#333' : '#ddd',
            },
          },
          x: {
            ticks: {
              color: this.theme() === 'dark' ? '#e5e5e5' : '#000',
            },
            grid: {
              color: this.theme() === 'dark' ? '#333' : '#ddd',
            },
          },
        },
      };
    }

    return {
      ...baseOptions,
      responsive: true,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins?.legend,
          display: true,
        },
      },
    };
  });

  renderChart = signal(true);

  constructor(private readonly _responsiveService: ResponsiveService) {
    effect(() => {
      this.chartType();

      this.renderChart.set(false);
      setTimeout(() => {
        this.renderChart.set(true);
      }, 0);
    });
  }
}
