import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { NgxCurrencyDirective } from 'ngx-currency';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { ReleaseType } from '../../../../../core/enums/release-enums';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-release-form',
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
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly currency = this._utils.getUserConfigs.currency;

  public form = input.required<FormGroup>();
  public accountsList = input.required<BasicAccount[]>();
  public categoriesList = input.required<Category[]>();
  public creditCardsList = input.required<BasicCard[]>();
  public selectedCreditCard = input.required<boolean>();

  currentDt: Date = new Date();

  filteredCategories: Category[] = [];

  selectedAccount: BasicAccount | BasicCard | null = null;
  selectedTargetAccount: BasicAccount | null = null;
  selectedCategory: Category | null = null;

  constructor(private readonly _utils: UtilsService) {}

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
      this._utils.showMessage('release-form.no-active-accounts-or-cards', 5000);
    }

    this.form().get('accountId')!.updateValueAndValidity();
    this.accountChanges(this.form().value.accountId);

    this.filteredCategories = this._utils.filterList(
      this.categoriesList(),
      'type',
      this.form().value.type
    );

    if (this.form().value.targetAccountId) {
      this.form().get('targetAccountId')!.updateValueAndValidity();
      this.targetAccountChanges(this.form().value.targetAccountId);
    }
  }

  public dateChanges(value: MatDatepickerInputEvent<any>) {
    this.form()
      .get('done')!
      .setValue(!moment(value.value).isAfter(this.currentDt));
  }

  public accountChanges(value: number) {
    const selectedAccount: BasicAccount | undefined = this.accountsList().find(
      (item) => item.id === value
    );

    const selectedCard: BasicCard | undefined = this.creditCardsList().find(
      (item) => item.id === value
    );

    this.selectedAccount = selectedAccount ? selectedAccount : selectedCard!;
  }

  public targetAccountChanges(value: number) {
    this.selectedTargetAccount = this.accountsList().find(
      (item) => item.id === value
    )!;
  }

  public categoryChanges(value: number) {
    this.selectedCategory = this.categoriesList().find(
      (item) => item.id === value
    )!;
  }

  get isExpense() {
    return this.form().value.type === ReleaseType.EXPENSE;
  }

  get isRevenue() {
    return this.form().value.type === ReleaseType.REVENUE;
  }

  get isTransfer() {
    return this.form().value.type === ReleaseType.TRANSFER;
  }
}
