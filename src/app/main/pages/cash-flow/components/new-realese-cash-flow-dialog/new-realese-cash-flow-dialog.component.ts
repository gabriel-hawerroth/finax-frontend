import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NewExpenseFormComponent } from './components/new-expense-form/new-expense-form.component';
import { NewRevenueFormComponent } from './components/new-revenue-form/new-revenue-form.component';
import { NewTransferFormComponent } from './components/new-transfer-form/new-transfer-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashFlowService } from '../../../../../services/cash-flow.service';
import { CashFlow } from '../../../../../interfaces/CashFlow';

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
export class NewRealeseCashFlowDialogComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _cashFlowService = inject(CashFlowService);
  private _matDialogRef = inject(MatDialogRef);

  language = this.utilsService.getUserConfigs.language;

  selectedTabIndex: number = 0;

  expenseForm!: FormGroup;
  revenueForm!: FormGroup;
  transferForm!: FormGroup;

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {
    this.expenseForm = this._fb.group({
      id: null,
      description: '',
      accountId: [null, Validators.required],
      amount: [0, Validators.required],
      type: ['E', Validators.required],
      done: [true, Validators.required],
      categoryId: null,
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
      categoryId: null,
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
    if (this.selectedTabIndex === 0) this.saveExpense();
    else if (this.selectedTabIndex === 1) this.saveRevenue();
    else if (this.selectedTabIndex === 2) this.saveTransfer();
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
      .catch((error) => {
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
      .catch((error) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a receita'
            : 'Error saving revenue'
        );
      });
  }

  saveTransfer() {
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
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a transferência'
            : 'Error saving transfer'
        );
      });
  }
}
