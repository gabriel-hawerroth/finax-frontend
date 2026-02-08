
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeAccount } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { HomeAccountItemComponent } from './home-account-item/home-account-item.component';

@Component({
  selector: 'app-home-accounts-list-widget',
  imports: [
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatDividerModule,
    RouterModule,
    HomeAccountItemComponent,
    DynamicButtonComponent
],
  templateUrl: './home-accounts-list-widget.component.html',
  styleUrl: './home-accounts-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccountsListWidget implements OnInit {
  currency = input.required<string>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  accountsList = signal<HomeAccount[]>([]);
  generalBalance = signal(0);

  finishedFetch = signal(false);
  errorFetching = signal(false);

  registerOneBtnConfig: ButtonConfig = {
    label: 'home.register-one',
  };

  constructor(private readonly _homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this._homeService
      .getAccountsList()
      .then((response) => {
        this.accountsList.set(response);

        this.generalBalance.set(
          response.reduce((count, item) => count + item.balance, 0)
        );
      })
      .catch(() => this.errorFetching.set(true))
      .finally(() => this.finishedFetch.set(true));
  }

  isntLastItem(index: number): boolean {
    return index !== this.accountsList().length - 1;
  }
}
