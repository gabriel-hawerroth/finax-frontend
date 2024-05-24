import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { AccountBasicList } from '../../../../../interfaces/account';
import { Category } from '../../../../../interfaces/category';
import { CardBasicList } from '../../../../../interfaces/credit-card';
import { UtilsService } from '../../../../../utils/utils.service';

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
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './release-form.component.html',
  styleUrl: './release-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseFormComponent implements OnInit {
  public form = input.required<FormGroup>();
  public accountsList = input.required<AccountBasicList[]>();
  public categoriesList = input.required<Category[]>();
  public creditCardsList = input.required<CardBasicList[]>();
  public selectedCreditCard = input.required<boolean>();

  public readonly utilsService = inject(UtilsService);

  public currency = this.utilsService.getUserConfigs.currency;

  private currentDt: Date = new Date();

  public filteredCategories: Category[] = [];

  public selectedAccount: AccountBasicList | CardBasicList | null = null;
  public selectedTargetAccount: AccountBasicList | null = null;
  public selectedCategory: Category | null = null;

  ngOnInit(): void {
    if (this.selectedCreditCard()) {
      this.selectedAccount = this.creditCardsList().find(
        (item) => item.id === this.form().value.accountId
      )!;
    }

    const categoryId = this.form().value.categoryId;
    if (categoryId) {
      this.selectedCategory = this.categoriesList().find(
        (item) => item.id === categoryId
      )!;
    }

    if (
      this.accountsList().length === 0 &&
      this.creditCardsList().length === 0
    ) {
      this.utilsService.showMessage(
        'release-form.no-active-accounts-or-cards',
        5000
      );
    }

    this.form().get('accountId')!.updateValueAndValidity();
    this.accountChanges(this.form().value.accountId);

    this.filteredCategories = this.utilsService.filterList(
      this.categoriesList(),
      'type',
      this.form().value.type
    );
  }

  dateChanges(value: any) {
    this.form().get('done')!.setValue(!value.value.isAfter(this.currentDt));
  }

  accountChanges(value: number) {
    const selectedAccount: AccountBasicList | undefined =
      this.accountsList().find((item) => item.id === value);

    const selectedCard: CardBasicList | undefined = this.creditCardsList().find(
      (item) => item.id === value
    );

    this.selectedAccount = selectedAccount ? selectedAccount : selectedCard!;
  }

  targetAccountChanges(value: number) {
    this.selectedTargetAccount = this.accountsList().find(
      (item) => item.id === value
    )!;
  }

  categoryChanges(value: number) {
    this.selectedCategory = this.categoriesList().find(
      (item) => item.id === value
    )!;
  }
}
