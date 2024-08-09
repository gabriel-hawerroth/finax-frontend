import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { HomeUpcomingRelease } from '../../../../../core/entities/home-p/home-dto';
import { HomeUpcomingReleaseItemComponent } from '../../components/home-upcoming-release-item/home-upcoming-release-item.component';

@Component({
  selector: 'app-home-payable-accounts-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatDividerModule,
    HomeUpcomingReleaseItemComponent,
  ],
  templateUrl: './home-payable-accounts-widget.component.html',
  styleUrl: './home-payable-accounts-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePayableAccountsWidget {
  releasesList = input.required<HomeUpcomingRelease[]>();
  currency = input.required<string>();

  isntLastItem(index: number): boolean {
    return index !== this.releasesList().length - 1;
  }
}
