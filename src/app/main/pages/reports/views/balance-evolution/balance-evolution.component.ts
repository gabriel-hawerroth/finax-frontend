import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-balance-evolution',
  imports: [TranslateModule, MatCardModule],
  templateUrl: './balance-evolution.component.html',
  styleUrl: './balance-evolution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceEvolutionPage {}
