import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewRealeseCashFlowDialogComponent } from './components/new-realese-cash-flow-dialog/new-realese-cash-flow-dialog.component';
import {
  CashFlowFilters,
  MonthlyCashFlow,
  TotalsCashFlow,
} from '../../../interfaces/CashFlow';
import { CashFlowService } from '../../../services/cash-flow.service';
import { LoginService } from '../../../services/login.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CustomCurrencyPipe,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
})
export class CashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _matDialog = inject(MatDialog);
  private _cashFlowService = inject(CashFlowService);
  private _loginService = inject(LoginService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  filterForm!: FormGroup;

  releases: MonthlyCashFlow[] = [];

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();

  searching: boolean = false;

  totals: TotalsCashFlow = {
    revenues: 0,
    expenses: 0,
    balance: 0,
  };

  ngOnInit(): void {
    this.buildForm();
    this.getReleases();
  }

  buildForm() {
    this.filterForm = this._fb.group({
      account: '',
    });
  }

  getReleases() {
    this.searching = true;

    const filters: CashFlowFilters = {
      userId: this._loginService.getLoggedUserId,
      month: this.currentMonth + 1,
      year: this.currentYear,
    };

    this._cashFlowService
      .getMonthlyReleases(filters)
      .then((response) => {
        this.releases = response;

        this.totals = {
          expenses: 0,
          revenues: 0,
          balance: 0,
        };

        response.forEach((item) => {
          if (item.type === 'R') this.totals.revenues += item.amount;
          else if (item.type === 'E') this.totals.expenses += item.amount;
        });

        this.totals.balance = this.totals.revenues - this.totals.expenses;
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao obter os lançamentos'
            : 'Error getting the releases'
        );
      })
      .finally(() => {
        this.searching = false;
      });
  }

  getMonthName(index: number): string {
    const tempDate = new Date(this.currentYear, index, 15);
    return tempDate.toLocaleString(this.language, { month: 'long' });
  }

  selectMonth(direction: 'before' | 'next'): void {
    if (direction === 'before') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }

    this.currentDate.setDate(15);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();

    this.getReleases();
  }

  addRelease() {
    lastValueFrom(
      this._matDialog
        .open(NewRealeseCashFlowDialogComponent, {
          data: {},
          panelClass: 'new-release-cash-flow-dialog',
          disableClose: true,
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getReleases();
    });
  }
}
