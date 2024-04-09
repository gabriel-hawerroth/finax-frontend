import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';
import { EssentialExpenses } from '../../../../../interfaces/home';
import { HomeService } from '../../../../../services/home.service';

@Component({
  selector: 'app-home-essential-expenses-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule, MeterGroupModule],
  templateUrl: './home-essential-expenses-widget.component.html',
  styleUrl: './home-essential-expenses-widget.component.scss',
})
export class HomeEssentialExpensesWidget implements OnInit {
  private _homeService = inject(HomeService);
  private _translateService = inject(TranslateService);

  essentialExpenses = signal<EssentialExpenses>({
    essentials: 0,
    notEssentials: 0,
  });

  essentialValues: MeterItem = {
    label: this._translateService.instant('home.essential-expenses'),
    color: 'red',
    value: 0,
  };

  nonEssentialValues: MeterItem = {
    label: this._translateService.instant('home.non-essential-expenses'),
    color: 'blue',
    value: 0,
  };

  ngOnInit(): void {
    this._homeService.getEssentialsExpenses().then((response) => {
      this.essentialExpenses.set(response);

      this.essentialValues.value = response.essentials;
    });
  }
}
