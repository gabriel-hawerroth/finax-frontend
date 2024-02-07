import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { CreditCardService } from '../../../services/credit-card.service';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CreditCard } from '../../../interfaces/CreditCard';
import { Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreditCardDetailsComponent } from './components/credit-card-details/credit-card-details.component';

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
  ],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.scss',
})
export class CreditCardsComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _creditCardService = inject(CreditCardService);
  private _router = inject(Router);
  private _bottomSheet = inject(MatBottomSheet);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;

  situationFilter = new FormControl();

  rows: CreditCard[] = [];
  filteredRows: BehaviorSubject<CreditCard[]> = new BehaviorSubject<
    CreditCard[]
  >([]);

  ngOnInit(): void {
    this.situationFilter.setValue(true);

    this._creditCardService.getByUser().then((response) => {
      this.rows = response;
      this.filterList();
    });

    this.situationFilter.valueChanges.subscribe(() => {
      this.filterList();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  filterList() {
    let rows = this.rows.slice();

    if (this.situationFilter.value !== 'all') {
      rows = this.utilsService.filterList(
        rows,
        'active',
        this.situationFilter.value
      );
    }

    this.filteredRows.next(rows);
  }

  onNew() {
    this._router.navigate(['cartoes-de-credito/novo']);
  }

  openDetails(card: any) {
    this._bottomSheet.open(CreditCardDetailsComponent, {
      data: {
        card,
      },
      panelClass: 'credit-card-details',
    });
  }
}
