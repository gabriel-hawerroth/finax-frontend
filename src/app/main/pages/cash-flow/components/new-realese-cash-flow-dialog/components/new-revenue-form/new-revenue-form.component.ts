import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../../../../../../../interfaces/Account';
import { UtilsService } from '../../../../../../../utils/utils.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Subject } from 'rxjs';
import { Category } from '../../../../../../../interfaces/Category';

@Component({
  selector: 'app-new-revenue-form',
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
  templateUrl: './new-revenue-form.component.html',
  styleUrl: './new-revenue-form.component.scss',
})
export class NewRevenueFormComponent implements OnInit, OnDestroy {
  @Input() revenueForm!: FormGroup;
  @Input() accountsList!: Account[];
  @Input() categoriesList!: Category[];

  public utilsService = inject(UtilsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  selectedAccount: Account | null = null;
  selectedCategory: Category | null = null;

  ngOnInit(): void {
    this.revenueForm.get('accountId')!.valueChanges.subscribe((value) => {
      this.selectedAccount = this.accountsList.find(
        (item) => item.id === value
      )!;
    });

    this.revenueForm.get('categoryId')!.valueChanges.subscribe((value) => {
      this.selectedCategory = this.categoriesList.find(
        (item) => item.id === value
      )!;
    });

    const accountId = this.revenueForm.get('accountId')!.value;
    const categoryId = this.revenueForm.get('categoryId')!.value;

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
    return this.utilsService.filterList(this.categoriesList, 'type', 'R');
  }
}
