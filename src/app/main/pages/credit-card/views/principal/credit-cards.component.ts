import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { UserCreditCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { CreditCardChangedEvent } from '../../../../../core/enums/entity-changed-events';
import { creditCardChangedEvent } from '../../../../../core/events/events';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { ResponsiveService } from '../../../../../shared/services/responsive.service';
import { SpeedDialService } from '../../../../../shared/services/speed-dial.service';
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
export class CreditCardsPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  situationFilter = new FormControl(true);
  situationFilterValue: boolean | 'all' = this.situationFilter.getRawValue()!;

  rows = signal<UserCreditCard[]>([]);
  filteredRows = signal<UserCreditCard[]>([]);

  finishedFetchingCards = signal(false);
  errorFetchingCards = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService,
    private readonly _responsiveService: ResponsiveService,
    private readonly _speedDialService: SpeedDialService
  ) {}

  ngOnInit(): void {
    this.getCards();
    this.subscribeCreditCardChangedEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  getCards() {
    this._creditCardService
      .getByUser()
      .then((response) => {
        this.rows.set(response);
        this.filterList(this.situationFilter.value!);
        this._speedDialService.loadCreditCards(this.rows());
      })
      .catch(() => this.errorFetchingCards.set(true))
      .finally(() => this.finishedFetchingCards.set(true));
  }

  filterList(value: 'all' | boolean) {
    let rows = this.rows().slice();

    if (value !== 'all') {
      rows = this._utils.filterList(rows, 'active', value);
    }

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigateByUrl('cartoes-de-credito/novo');
  }

  private subscribeCreditCardChangedEvent() {
    creditCardChangedEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event) => {
        switch (event.event) {
          case CreditCardChangedEvent.DELETED:
            this.onDeleted(event.creditCardId);
            break;
          case CreditCardChangedEvent.INACTIVATED:
            this.onInactivated(event.creditCardId);
            break;
          case CreditCardChangedEvent.ACTIVATED:
            this.onActivated(event.creditCardId);
            break;
        }
      });
  }

  private onDeleted(creditCardId: number) {
    this.rows.update((rows) => {
      return [...rows.filter((row) => row.id !== creditCardId)];
    });

    this.filterList(this.situationFilter.value!);
  }

  private onInactivated(creditCardId: number) {
    this.rows.update((rows) => {
      rows.forEach((row) => {
        if (row.id === creditCardId) row.active = false;
      });

      return [...rows];
    });

    this.filterList(this.situationFilter.value!);
  }

  private onActivated(creditCardId: number) {
    this.rows.update((rows) => {
      rows.forEach((row) => {
        if (creditCardId === row.id!) row.active = true;
      });

      return [...rows];
    });

    this.filterList(this.situationFilter.value!);
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
