import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { SpendByCategory } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { SpendByCategoryInterval } from '../../../../../core/enums/spend-by-category-interval';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { LS_DATE_INTERVAL_SPENDS_BY_CATEGORY } from '../../../../../shared/utils/local-storage-contants';
import { UtilsService } from '../../../../../shared/utils/utils.service';

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
    ReactiveFormsModule,
    MatSelectModule,
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
  firstDt = signal(new Date());
  lastDt = signal(new Date());

  data!: ChartData;
  options!: ChartOptions;

  dateInterval = new FormControl<SpendByCategoryInterval>(
    (this._utils.getItemLocalStorage(
      LS_DATE_INTERVAL_SPENDS_BY_CATEGORY
    ) as SpendByCategoryInterval) || SpendByCategoryInterval.LAST_30_DAYS
  );

  finishedFetch = signal(false);
  errorFetching = signal(false);

  constructor(
    private readonly _homeService: HomeService,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.getSpends();

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

  getSpends(dateInterval?: SpendByCategoryInterval) {
    this._homeService
      .getSpendsByCategory(dateInterval || this.dateInterval.value!)
      .then((response) => {
        this.spendsByCategory.set(response.spendByCategories);
        this.firstDt.set(response.startDate);
        this.lastDt.set(response.endDate);
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
      })
      .catch(() => this.errorFetching.set(true))
      .finally(() => this.finishedFetch.set(true));
  }

  isntLastItem(index: number) {
    return index != this.spendsByCategory().length - 1;
  }

  get hasMoreThenFourCategories() {
    return this.spendsByCategory().length > 4;
  }

  getIntervalEnum(interval: 'LAST_30_DAYS' | 'CURRENT_MONTH') {
    return SpendByCategoryInterval[interval];
  }

  onChangeDateInterval(newValue: SpendByCategoryInterval) {
    this.getSpends(newValue);
    this._utils.setItemLocalStorage(
      LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
      newValue
    );
  }
}
