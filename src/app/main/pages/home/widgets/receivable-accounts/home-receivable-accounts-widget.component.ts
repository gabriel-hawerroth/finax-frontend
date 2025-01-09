import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { HomeUpcomingRelease } from '../../../../../core/entities/home-p/home-dto';
import { HomeUpcomingReleaseItemComponent } from '../../components/home-upcoming-release-item/home-upcoming-release-item.component';

@Component({
  selector: 'app-home-receivable-accounts-widget',
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatDividerModule,
    HomeUpcomingReleaseItemComponent,
  ],
  templateUrl: './home-receivable-accounts-widget.component.html',
  styleUrl: './home-receivable-accounts-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeReceivableAccountsWidget {
  releasesList = input.required<HomeUpcomingRelease[]>();
  currency = input.required<string>();
  finishedFetch = input.required<boolean>();
  errorFetching = input.required<boolean>();

  isntLastItem(index: number): boolean {
    return index !== this.releasesList().length - 1;
  }
}
