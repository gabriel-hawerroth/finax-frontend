import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  private _homeService = inject(HomeService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _translate = inject(TranslateService);

  language: string = this.utilsService.getUserConfigs.language;
  currency: string = this.utilsService.getUserConfigs.currency;

  homeValues: HomeValues = {
    balances: {
      revenues: 0,
      expenses: 0,
    },
    accountsList: [],
    upcomingReleasesExpected: [],
  };

  generalBalance: number = 0;

  ngOnInit(): void {
    this._translate.use(this.language);

    this.getValues();
  }

  getValues() {
    this._homeService.getHomeValues().then((response) => {
      this.homeValues = response;

      response.accountsList.forEach((account) => {
        this.generalBalance += account.balance;
      });

      this._changeDetectorRef.detectChanges();
    });
  }

  getUpcomingReleases(type: 'R' | 'E'): MonthlyCashFlow[] {
    return this.utilsService.filterList(
      this.homeValues.upcomingReleasesExpected,
      'type',
      type
    );
  }

  isntLastItemAccounts(id: number): boolean {
    const index = this.homeValues.accountsList.findIndex(
      (item) => item.id === id
    );

    return index !== this.homeValues.accountsList.length - 1;
  }

  isntLastItem(id: number, type: 'R' | 'E'): boolean {
    const index = this.getUpcomingReleases(type).findIndex(
      (item) => item.id === id
    );

    return index !== this.getUpcomingReleases(type).length - 1;
  }
}
