import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { SpendByCategory } from '../../../../../interfaces/home';
import { HomeService } from '../../../../../services/home.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../utils/utils.service';

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
  ],
  templateUrl: './home-spend-by-category-widget.component.html',
  styleUrl: './home-spend-by-category-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSpendByCategoryWidget implements OnInit {
  private _homeService = inject(HomeService);

  spendsByCategory = signal<SpendByCategory[]>([]);

  darkTheme: boolean = inject(UtilsService).getUserConfigs.theme === 'dark';
  currency: string = inject(UtilsService).getUserConfigs.currency;

  currentDt = new Date();
  firstDt = new Date(this.currentDt.setDate(1));
  lastDt = new Date(
    new Date(this.currentDt.setMonth(this.currentDt.getMonth() + 1)).setDate(
      1 - 1
    )
  ).toString();

  data!: ChartData;
  options!: ChartOptions;

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
            borderColor: this.darkTheme ? '#dededeea' : '#fff',
          },
        ],
        labels: this.spendsByCategory().map((exp) => exp.category.name),
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: this.darkTheme ? '#e5e5e5' : '#000',
            },
          },
          tooltip: {
            callbacks: {
              label: (data) => {
                return ` ${this.currency}${data.formattedValue}`;
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
}
