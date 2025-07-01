import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData } from 'chart.js';
import { SpendByCategory } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { ButtonType } from '../../../../../core/enums/button-style';
import { SpendByCategoryInterval } from '../../../../../core/enums/spend-by-category-interval';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleasesByCategoryCardComponent } from '../../components/releases-by-category-card/releases-by-category-card.component';

@Component({
  selector: 'app-releases-by-category',
  imports: [
    TranslateModule,
    DynamicButtonComponent,
    ReleasesByCategoryCardComponent,
    ReleasesMonthPipe,
  ],
  templateUrl: './releases-by-category.component.html',
  styleUrl: './releases-by-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCategoryComponent implements OnInit {
  searching = signal(false);
  errorFetching = signal(false);
  finishedFetch = signal(false);

  navigateBackBtnConfig: ButtonConfig = {
    icon: 'chevron_left',
    type: ButtonType.ICON,
    disabled: this.searching(),
    onClick: () => this.changeMonth('before'),
  };

  navigateNextBtnConfig: ButtonConfig = {
    icon: 'chevron_right',
    type: ButtonType.ICON,
    disabled: this.searching(),
    onClick: () => this.changeMonth('next'),
  };

  selectedDate = new Date(new Date().setDate(15));

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  spendsByCategory = signal<SpendByCategory[]>([]);
  spendsByCategoryChartData!: ChartData;

  revenuesByCategory = signal<SpendByCategory[]>([]);
  revenuesByCategoryChartData!: ChartData;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.getSpends();
  }

  changeMonth(direction: 'before' | 'next') {}

  getSpends() {
    this.searching.set(true);

    this._homeService
      .getSpendsByCategory(SpendByCategoryInterval.CURRENT_MONTH)
      .then((response) => {
        this.spendsByCategory.set(response.spendByCategories);
        this.spendsByCategoryChartData = {
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

        this.revenuesByCategory.set(this.spendsByCategory());
        this.revenuesByCategoryChartData = this.spendsByCategoryChartData;
      })
      .catch(() => this.errorFetching.set(true))
      .finally(() => {
        this.searching.set(false);
        this.finishedFetch.set(true);
      });
  }
}
