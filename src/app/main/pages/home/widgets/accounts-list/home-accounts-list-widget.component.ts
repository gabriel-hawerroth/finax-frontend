import { CommonModule } from '@angular/common';
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
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { HomeAccountItemComponent } from './home-account-item/home-account-item.component';

@Component({
  selector: 'app-home-accounts-list-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatDividerModule,
    RouterModule,
    ButtonsComponent,
    HomeAccountItemComponent,
  ],
  templateUrl: './home-accounts-list-widget.component.html',
  styleUrl: './home-accounts-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccountsListWidget implements OnInit {
  currency = input.required<string>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  accountsList = signal<HomeAccount[]>([]);
  generalBalance = signal<number>(0);

  finishedFetch = signal<boolean>(false);
  errorFetching = signal<boolean>(false);

  constructor(
    private readonly _homeService: HomeService,
    private readonly _utils: UtilsService
  ) {}

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
