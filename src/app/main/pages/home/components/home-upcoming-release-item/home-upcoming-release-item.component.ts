import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HomeUpcomingRelease } from '../../../../../core/entities/home-p/home-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-home-upcoming-release-item',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe],
  templateUrl: './home-upcoming-release-item.component.html',
  styleUrl: './home-upcoming-release-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUpcomingReleaseItemComponent {
  public readonly release = input.required<HomeUpcomingRelease>();
  public readonly currency = input.required<string>();
}
