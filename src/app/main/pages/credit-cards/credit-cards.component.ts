import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { CreditCardService } from '../../../services/credit-card.service';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CreditCard } from '../../../interfaces/credit-card';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreditCardDetailsComponent } from './components/credit-card-details/credit-card-details.component';
import { TranslateModule } from '@ngx-translate/core';

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
export class CreditCardsComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _creditCardService = inject(CreditCardService);
  private _router = inject(Router);
  private _bottomSheet = inject(MatBottomSheet);

  situationFilter = new FormControl(true);

  rows: CreditCard[] = [];
  filteredRows: WritableSignal<CreditCard[]> = signal([]);

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
      rows = this.utilsService.filterList(rows, 'active', value);
    }

    this.filteredRows.set(rows);
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
