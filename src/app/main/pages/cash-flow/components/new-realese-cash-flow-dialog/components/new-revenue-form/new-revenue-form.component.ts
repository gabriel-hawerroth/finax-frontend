import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../../../../../../../interfaces/Account';
import { AccountService } from '../../../../../../../services/account.service';
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

    this.revenueForm.get('accountId')!.valueChanges.subscribe((value) => {
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
