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
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { CreditCardsListComponent } from '../../components/credit-cards-list/credit-cards-list.component';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
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

  rows: UserCreditCard[] = [];
  filteredRows = signal<UserCreditCard[]>([]);

  finishedFetchingCards = signal(false);
  errorFetchingCards = signal(false);

  constructor(
    public readonly utils: UtilsService,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService
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
      rows = this.utils.filterList(rows, 'active', value);
    }

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigateByUrl('cartoes-de-credito/novo');
  }
}
