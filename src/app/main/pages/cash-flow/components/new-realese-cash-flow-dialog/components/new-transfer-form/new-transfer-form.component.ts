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
  @Input() accountsList!: Account[];

  public utilsService = inject(UtilsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  selectedAccountLeave: Account | null = null;
  selectedAccountEnter: Account | null = null;

  ngOnInit(): void {
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

    const accountId = this.transferForm.get('accountId')!.value;
    const targetAccountId = this.transferForm.get('targetAccountId')!.value;

    if (accountId) {
      this.selectedAccountLeave = this.accountsList.find(
        (item) => item.id === accountId
      )!;
    }

    if (targetAccountId) {
      this.selectedAccountEnter = this.accountsList.find(
        (item) => item.id === targetAccountId
      )!;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }
}
