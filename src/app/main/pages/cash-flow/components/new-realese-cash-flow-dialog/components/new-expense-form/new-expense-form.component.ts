import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilsService } from '../../../../../../../utils/utils.service';
import { Account } from '../../../../../../../interfaces/Account';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { Category } from '../../../../../../../interfaces/Category';

@Component({
  selector: 'app-new-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxCurrencyDirective,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgOptimizedImage,
    MatButtonModule,
  ],
  templateUrl: './new-expense-form.component.html',
  styleUrl: './new-expense-form.component.scss',
})
export class NewExpenseFormComponent implements OnInit, OnDestroy {
  @Input() expenseForm!: FormGroup;
  @Input() accountsList!: Account[];
  @Input() categoriesList!: Category[];

  public utilsService = inject(UtilsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  selectedAccount: Account | null = null;
  selectedCategory: Category | null = null;

  ngOnInit(): void {
    this.expenseForm.get('accountId')!.valueChanges.subscribe((value) => {
      this.selectedAccount = this.accountsList.find(
        (item) => item.id === value
      )!;
    });

    this.expenseForm.get('categoryId')!.valueChanges.subscribe((value) => {
      this.selectedCategory = this.categoriesList.find(
        (item) => item.id === value
      )!;
    });

    const accountId = this.expenseForm.get('accountId')!.value;
    const categoryId = this.expenseForm.get('categoryId')!.value;

    if (accountId) {
      this.selectedAccount = this.accountsList.find(
        (item) => item.id === accountId
      )!;
    }

    if (categoryId) {
      this.selectedCategory = this.categoriesList.find(
        (item) => item.id === categoryId
      )!;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  get getCategories(): Category[] {
    return this.utilsService.filterList(this.categoriesList, 'type', 'E');
  }
}
