import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UtilsService } from '../../../../../../../utils/utils.service';
import { Account } from '../../../../../../../interfaces/Account';
import { Category } from '../../../../../../../interfaces/Category';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  ],
  templateUrl: './release-form.component.html',
  styleUrl: './release-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseFormComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() accountsList!: Account[];
  @Input() categoriesList!: Category[];

  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  selectedAccount: Account | null = null;
  selectedTargetAccount: Account | null = null;
  selectedCategory: Category | null = null;

  ngOnInit(): void {
    this.form.get('accountId')!.valueChanges.subscribe((value) => {
      this.selectedAccount = this.accountsList.find(
        (item) => item.id === value
      )!;
    });

    this.form.get('targetAccountId')!.valueChanges.subscribe((value) => {
      this.selectedTargetAccount = this.accountsList.find(
        (item) => item.id === value
      )!;
    });

    this.form.get('categoryId')!.valueChanges.subscribe((value) => {
      this.selectedCategory = this.categoriesList.find(
        (item) => item.id === value
      )!;
    });

    const accountId = this.form.get('accountId')!.value;
    const categoryId = this.form.get('categoryId')!.value;

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

  get getCategories(): Category[] {
    return this.utilsService.filterList(
      this.categoriesList,
      'type',
      this.form.get('type')!.value
    );
  }
}
