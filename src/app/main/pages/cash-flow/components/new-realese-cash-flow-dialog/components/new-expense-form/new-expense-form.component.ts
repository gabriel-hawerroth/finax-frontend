import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilsService } from '../../../../../../../utils/utils.service';
import { Account } from '../../../../../../../interfaces/Account';
import { AccountService } from '../../../../../../../services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';

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

  public utilsService = inject(UtilsService);
  private _accountsService = inject(AccountService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  accountsList: Account[] = [];
  selectedAccount: Account | null = null;

  ngOnInit(): void {
    this._accountsService.getByUser().then((response) => {
      this.accountsList = response;
    });

    this.expenseForm.get('accountId')!.valueChanges.subscribe((value) => {
      this.selectedAccount = this.accountsList.find(
        (item) => item.id === value
      )!;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }
}
