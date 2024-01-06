import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NewExpenseFormComponent } from './components/new-expense-form/new-expense-form.component';
import { NewRevenueFormComponent } from './components/new-revenue-form/new-revenue-form.component';
import { NewTransferFormComponent } from './components/new-transfer-form/new-transfer-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashFlowService } from '../../../../../services/cash-flow.service';
import { CashFlow } from '../../../../../interfaces/CashFlow';
import { Category } from '../../../../../interfaces/Category';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-new-realese-cash-flow-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    NewExpenseFormComponent,
    NewRevenueFormComponent,
    NewTransferFormComponent,
  ],
  templateUrl: './new-realese-cash-flow-dialog.component.html',
  styleUrl: './new-realese-cash-flow-dialog.component.scss',
})
export class NewRealeseCashFlowDialogComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _cashFlowService = inject(CashFlowService);
  private _matDialogRef = inject(MatDialogRef);

  language = this.utilsService.getUserConfigs.language;

  selectedTabIndex: number = 0;

  expenseForm!: FormGroup;
  revenueForm!: FormGroup;
  transferForm!: FormGroup;

  _unsubscribeAll: Subject<any> = new Subject();

  ngOnInit(): void {
    this.buildForms();

    if (this.data.editing) {
      switch (this.data.release.type) {
        case 'E':
          this.selectedTabIndex = 0;
          this.expenseForm.patchValue(this.data.release);
          break;

        case 'R':
          this.selectedTabIndex = 1;
          this.revenueForm.patchValue(this.data.release);
          break;

        case 'T':
          this.selectedTabIndex = 2;
          this.transferForm.patchValue(this.data.release);
          break;
      }
    } else {
      const otherExpensesCategorieId: number = this.data.categories.find(
        (item: Category) => item.name === 'Outras despesas'
      ).id;
      this.expenseForm.get('categoryId')!.setValue(otherExpensesCategorieId);

      const otherRevenuesCategorieId: number = this.data.categories.find(
        (item: Category) => item.name === 'Outras receitas'
      ).id;
      this.revenueForm.get('categoryId')!.setValue(otherRevenuesCategorieId);
    }

    this.subscribeDateChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  buildForms() {
    this.expenseForm = this._fb.group({
      id: null,
      description: '',
      accountId: [null, Validators.required],
      amount: [0, Validators.required],
      type: ['E', Validators.required],
      done: [true, Validators.required],
      categoryId: [null, Validators.required],
      date: [new Date(), Validators.required],
      time: '',
      observation: '',
    });

    this.revenueForm = this._fb.group({
      id: null,
      description: '',
      accountId: [null, Validators.required],
      amount: [0, Validators.required],
      type: ['R', Validators.required],
      done: [true, Validators.required],
      categoryId: [null, Validators.required],
      date: [new Date(), Validators.required],
      time: '',
      observation: '',
    });

    this.transferForm = this._fb.group({
      id: '',
      description: '',
      accountId: [null, Validators.required],
      amount: [0, Validators.required],
      type: ['T', Validators.required],
      done: [true, Validators.required],
      categoryId: null,
      targetAccountId: [null, Validators.required],
      date: [new Date(), Validators.required],
      time: '',
      observation: '',
    });

    this.expenseForm.markAllAsTouched();
    this.revenueForm.markAllAsTouched();
    this.transferForm.markAllAsTouched();
  }

  subscribeDateChanges() {
    this.expenseForm
      .get('date')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.expenseForm
          .get('done')!
          .setValue(!moment(value).isAfter(new Date()));
      });
    this.revenueForm
      .get('date')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.revenueForm
          .get('done')!
          .setValue(!moment(value).isAfter(new Date()));
      });
    this.transferForm
      .get('date')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.transferForm
          .get('done')!
          .setValue(!moment(value).isAfter(new Date()));
      });
  }

  disableSave(): boolean {
    if (this.selectedTabIndex === 0) {
      return this.expenseForm.pristine || this.expenseForm.invalid;
    } else if (this.selectedTabIndex === 1) {
      return this.revenueForm.pristine || this.revenueForm.invalid;
    } else {
      return this.transferForm.pristine || this.transferForm.invalid;
    }
  }

  save() {
    if (this.selectedTabIndex === 0) {
      if (this.expenseForm.value.amount === 0) {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'O valor deve ser maior que zero'
            : 'The amount must be greater than zero'
        );
      } else {
        this.saveExpense();
      }
    } else if (this.selectedTabIndex === 1) {
      if (this.revenueForm.value.amount === 0) {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'O valor deve ser maior que zero'
            : 'The amount must be greater than zero'
        );
      } else {
        this.saveRevenue();
      }
    } else if (this.selectedTabIndex === 2) {
      if (this.transferForm.value.amount === 0) {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'O valor deve ser maior que zero'
            : 'The amount must be greater than zero'
        );
      } else {
        this.saveTransfer();
      }
    }
  }

  saveExpense() {
    this._cashFlowService
      .save(this.expenseForm.value)
      .then((response: CashFlow) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Despesa salva com sucesso'
            : 'Expense saved successfully'
        );
        this._matDialogRef.close(true);
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a despesa'
            : 'Error saving expense'
        );
      });
  }

  saveRevenue() {
    this._cashFlowService
      .save(this.revenueForm.value)
      .then((response: CashFlow) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Receita salva com sucesso'
            : 'Revenue saved successfully'
        );
        this._matDialogRef.close(true);
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a receita'
            : 'Error saving revenue'
        );
      });
  }

  saveTransfer() {
    if (
      this.transferForm.value.accountId ===
      this.transferForm.value.targetAccountId
    ) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'Não é possível realizar uma transferência para o mesmo banco'
          : 'It is not possible to make a transfer to the same bank'
      );
      return;
    }

    this._cashFlowService
      .save(this.transferForm.value)
      .then((response: CashFlow) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Transferência salva com sucesso'
            : 'Transfer saved successfully'
        );
        this._matDialogRef.close(true);
      })
      .catch((error) => {
        if (error.error.status === 406) {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Saldo insuficiente'
              : 'Insufficient balance'
          );
        } else {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Erro ao salvar a transferência'
              : 'Error saving transfer'
          );
        }
      });
  }
}
