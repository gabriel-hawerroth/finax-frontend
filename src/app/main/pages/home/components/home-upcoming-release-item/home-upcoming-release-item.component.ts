import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  addHours,
  isBefore,
  isSameDay,
  startOfDay,
  startOfToday,
} from 'date-fns';
import { HomeUpcomingRelease } from '../../../../../core/entities/home-p/home-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-home-upcoming-release-item',
  imports: [CommonModule, CustomCurrencyPipe],
  templateUrl: './home-upcoming-release-item.component.html',
  styleUrl: './home-upcoming-release-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUpcomingReleaseItemComponent {
  readonly release = input.required<HomeUpcomingRelease>();
  readonly currency = input.required<string>();

  get isLate() {
    return isBefore(
      startOfDay(addHours(this.release().date, 3)),
      startOfToday()
    );
  }

  get isToday() {
    return isSameDay(startOfToday(), addHours(this.release().date, 3));
  }
}
