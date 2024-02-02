import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../../services/login.service';
import { HomeService } from '../../../services/home.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { MatDividerModule } from '@angular/material/divider';
import { HomeValues } from '../../../interfaces/Home';
import { MonthlyCashFlow } from '../../../interfaces/CashFlow';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatDividerModule,
    NgOptimizedImage,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  private _homeService = inject(HomeService);

  language: string = this.utilsService.getUserConfigs.language;
  currency: string = this.utilsService.getUserConfigs.currency;

  homeValues: BehaviorSubject<HomeValues> = new BehaviorSubject<HomeValues>({
    generalBalance: 0,
    monthlyFlow: {
      revenues: 0,
      expenses: 0,
    },
    accountsList: [],
    upcomingReleasesExpected: [],
  });

  accountsPayable: MonthlyCashFlow[] = [];
  accountsReceivable: MonthlyCashFlow[] = [];

  ngOnInit(): void {
    this._homeService.getHomeValues().then((response) => {
      this.homeValues.next(response);
    });
  }

  getUpcomingReleases(type: string): MonthlyCashFlow[] {
    return this.utilsService.filterList(
      this.homeValues.value.upcomingReleasesExpected,
      'type',
      type
    );
  }

  isntLastItemAccounts(id: number): boolean {
    const index = this.homeValues.value.accountsList.findIndex(
      (item) => item.id === id
    );

    return index !== this.homeValues.value.accountsList.length - 1;
  }

  isntLastItem(id: number, type: string): boolean {
    const index = this.getUpcomingReleases(type).findIndex(
      (item) => item.id === id
    );

    return index !== this.getUpcomingReleases(type).length - 1;
  }
}
