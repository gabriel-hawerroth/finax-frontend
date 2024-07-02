import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CreditCardDetailsData,
  UserCreditCard,
} from '../../../../../core/entities/credit-card/credit-card-dto';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { CreditCardDetailsComponent } from '../details/credit-card-details.component';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ButtonsComponent,
    MatFormFieldModule,
    MatSelectModule,
    NgOptimizedImage,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  situationFilter = new FormControl(true);

  rows: UserCreditCard[] = [];
  filteredRows = signal<UserCreditCard[]>([]);

  constructor(
    public readonly utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService
  ) {}

  ngOnInit(): void {
    this.getCards();
  }

  getCards() {
    this._creditCardService.getByUser().then((response) => {
      this.rows = response;
      this.filterList(this.situationFilter.value!);
    });
  }

  filterList(value: 'all' | boolean) {
    let rows = this.rows.slice();

    if (value !== 'all') {
      rows = this.utils.filterList(rows, 'active', value);
    }

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigate(['cartoes-de-credito/novo']);
  }

  openDetails(card: UserCreditCard) {
    this._bottomSheet.open(CreditCardDetailsComponent, {
      data: <CreditCardDetailsData>{
        card,
      },
      panelClass: 'credit-card-details',
    });
  }
}
