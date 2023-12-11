import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Account } from '../../../../../../../interfaces/Account';
import { AccountService } from '../../../../../../../services/account.service';
import { UtilsService } from '../../../../../../../utils/utils.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-transfer-form',
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
  templateUrl: './new-transfer-form.component.html',
  styleUrl: './new-transfer-form.component.scss',
})
export class NewTransferFormComponent implements OnInit, OnDestroy {
  @Input() transferForm!: FormGroup;

  public utilsService = inject(UtilsService);
  private _accountsService = inject(AccountService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  accountsList: Account[] = [];
  selectedAccountLeave: Account | null = null;
  selectedAccountEnter: Account | null = null;

  ngOnInit(): void {
    this._accountsService.getByUser().then((response) => {
      this.accountsList = response;
    });

    this.transferForm.get('accountId')!.valueChanges.subscribe((value) => {
      this.selectedAccountLeave = this.accountsList.find(
        (item) => item.id === value
      )!;
    });

    this.transferForm
      .get('targetAccountId')!
      .valueChanges.subscribe((value) => {
        this.selectedAccountEnter = this.accountsList.find(
          (item) => item.id === value
        )!;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }
}
