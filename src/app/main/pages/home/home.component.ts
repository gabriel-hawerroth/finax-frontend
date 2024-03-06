import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { HomeService } from '../../../services/home.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { MatDividerModule } from '@angular/material/divider';
import { HomeValues } from '../../../interfaces/home';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyRelease } from '../../../interfaces/cash-flow';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatDividerModule,
    NgOptimizedImage,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _homeService = inject(HomeService);

  currency: string = this.utilsService.getUserConfigs.currency;

  homeValues: WritableSignal<HomeValues> = signal({
    balances: {
      revenues: 0,
      expenses: 0,
    },
    accountsList: [],
    upcomingReleasesExpected: [],
  });

  generalBalance: number = 0;

  ngOnInit(): void {
    this.getValues();
  }

  getValues() {
    this._homeService.getHomeValues().then((response: HomeValues) => {
      this.homeValues.set(response);

      response.accountsList.forEach((account) => {
        this.generalBalance += account.balance;
      });
    });
  }

  getUpcomingReleases(type: 'R' | 'E'): MonthlyRelease[] {
    return this.utilsService.filterList(
      this.homeValues().upcomingReleasesExpected,
      'type',
      type
    );
  }

  isntLastItemAccounts(id: number): boolean {
    const index = this.homeValues().accountsList.findIndex(
      (item) => item.id === id
    );

    return index !== this.homeValues().accountsList.length - 1;
  }

  isntLastItem(id: number, type: 'R' | 'E'): boolean {
    const index = this.getUpcomingReleases(type).findIndex(
      (item) => item.id === id
    );

    return index !== this.getUpcomingReleases(type).length - 1;
  }
}
