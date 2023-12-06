import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
})
export class CashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private locale = inject(LOCALE_ID);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  date: FormControl = new FormControl(new Date());

  releases: any[] = [];

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();

  ngOnInit(): void {}

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
  }
}
