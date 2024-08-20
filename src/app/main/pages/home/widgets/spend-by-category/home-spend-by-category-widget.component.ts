import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { SpendByCategory } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home-spend-by-category-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatDividerModule,
    ChartModule,
    MatTooltipModule,
  ],
  templateUrl: './home-spend-by-category-widget.component.html',
  styleUrl: './home-spend-by-category-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSpendByCategoryWidget implements OnInit {
  theme = input.required<string>();
  currency = input.required<string>();

  spendsByCategory = signal<SpendByCategory[]>([]);

  currentDt = new Date();
  firstDt = new Date(this.currentDt.setDate(1));
  lastDt = new Date(
    new Date(this.currentDt.setMonth(this.currentDt.getMonth() + 1)).setDate(
      1 - 1
    )
  ).toString();

  data!: ChartData;
  options!: ChartOptions;

  constructor(private _homeService: HomeService) {}

  ngOnInit(): void {
    this._homeService.getSpendsByCategory().then((response) => {
      this.spendsByCategory.set(response);

      this.data = {
        datasets: [
          {
            data: this.spendsByCategory().map((exp) => exp.value),
            backgroundColor: this.spendsByCategory().map(
              (exp) => exp.category.color
            ),
            borderColor: this.theme() === 'dark' ? '#dededeea' : '#fff',
          },
        ],
        labels: this.spendsByCategory().map((exp) => exp.category.name),
      };

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
    });
  }

  isntLastItem(index: number) {
    return index != this.spendsByCategory().length - 1;
  }

  get hasMoreThenFourCategories() {
    return this.spendsByCategory().length > 4;
  }
}
