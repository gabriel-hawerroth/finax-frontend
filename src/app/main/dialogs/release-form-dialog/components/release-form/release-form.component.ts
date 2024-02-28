import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AccountBasicList } from '../../../../../interfaces/Account';
import { Category } from '../../../../../interfaces/Category';
import { UtilsService } from '../../../../../utils/utils.service';
import { CardBasicList } from '../../../../../interfaces/CreditCard';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-release-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    NgOptimizedImage,
    NgxCurrencyDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './release-form.component.html',
  styleUrl: './release-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseFormComponent implements OnInit, OnDestroy {
  @Input() releaseType!: string;
  @Input() form!: FormGroup;
  @Input() accountsList: AccountBasicList[] = [];
  @Input() categoriesList: Category[] = [];
  @Input() creditCardsList: CardBasicList[] = [];
  @Input() selectedCreditCard!: boolean;

  public utilsService = inject(UtilsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  currency = this.utilsService.getUserConfigs.currency;

  selectedAccount: any | null = null;
  selectedTargetAccount: AccountBasicList | null = null;
  selectedCategory: Category | null = null;

  ngOnInit(): void {
    this.subscribeFormChanges();

    if (this.selectedCreditCard) {
      this.selectedAccount = this.creditCardsList.find(
        (item) => item.id === this.form.value.accountId
      );
    }

    const categoryId = this.form.value.categoryId;
    if (categoryId) {
      this.selectedCategory = this.categoriesList.find(
        (item) => item.id === categoryId
      )!;
    }

    if (this.accountsList.length === 0 && this.creditCardsList.length === 0) {
      this.utilsService.showMessage(
        'release-form.no-active-accounts-or-cards',
        5000
      );
    }

    this.form.get('accountId')!.setValue(this.form.get('accountId')!.value);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  subscribeFormChanges() {
    this.form
      .get('date')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.form.get('done')!.setValue(!moment(value).isAfter(new Date()));
      });

    this.form
      .get('accountId')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        const selectedAccount: AccountBasicList | undefined =
          this.accountsList.find((item) => item.id === value);

        const selectedCard: CardBasicList | undefined =
          this.creditCardsList.find((item) => item.id === value);

        this.selectedAccount = selectedAccount ? selectedAccount : selectedCard;
      });

    this.form
      .get('targetAccountId')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.selectedTargetAccount = this.accountsList.find(
          (item) => item.id === value
        )!;
      });

    this.form
      .get('categoryId')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.selectedCategory = this.categoriesList.find(
          (item) => item.id === value
        )!;
      });
  }

  get getCategories(): Category[] {
    return this.utilsService.filterList(
      this.categoriesList,
      'type',
      this.form.get('type')!.value
    );
  }
}
