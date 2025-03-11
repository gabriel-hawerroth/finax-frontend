import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserCreditCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import {
  getResponsiveFieldWidth,
  Widths,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { CreditCardsListComponent } from '../../components/credit-cards-list/credit-cards-list.component';

@Component({
  selector: 'app-credit-cards',
  imports: [
    CommonModule,
    MatCardModule,
    ButtonsComponent,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    CreditCardsListComponent,
  ],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsPage implements OnInit {
  situationFilter = new FormControl(true);
  situationFilterValue: boolean | 'all' = this.situationFilter.getRawValue()!;

  rows: UserCreditCard[] = [];
  filteredRows = signal<UserCreditCard[]>([]);

  finishedFetchingCards = signal(false);
  errorFetchingCards = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getCards();
  }

  getCards() {
    this._creditCardService
      .getByUser()
      .then((response) => {
        this.rows = response;
        this.filterList(this.situationFilter.value!);
      })
      .catch(() => this.errorFetchingCards.set(true))
      .finally(() => this.finishedFetchingCards.set(true));
  }

  filterList(value: 'all' | boolean) {
    let rows = this.rows.slice();

    if (value !== 'all') {
      rows = this._utils.filterList(rows, 'active', value);
    }

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigateByUrl('cartoes-de-credito/novo');
  }

  getResponsiveFieldWidth(
    widths: Widths,
    defaultWidth?: string,
    minWidth?: string
  ) {
    return getResponsiveFieldWidth(
      widths,
      defaultWidth,
      minWidth
    )(this._responsiveService);
  }
}
