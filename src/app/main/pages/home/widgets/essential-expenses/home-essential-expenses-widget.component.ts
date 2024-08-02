import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';
import { EssentialExpenses } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';

@Component({
  selector: 'app-home-essential-expenses-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule, MeterGroupModule],
  templateUrl: './home-essential-expenses-widget.component.html',
  styleUrl: './home-essential-expenses-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEssentialExpensesWidget implements OnInit {
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

  constructor(
    private readonly _translateService: TranslateService,
    private readonly _homeService: HomeService
  ) {}

  ngOnInit(): void {
    this._homeService.getEssentialsExpenses().then((response) => {
      this.essentialExpenses.set(response);

      this.essentialValues.value = response.essentials;
    });
  }
}
