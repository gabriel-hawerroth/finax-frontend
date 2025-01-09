import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeCreditCard } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { HomeCreditCardItemComponent } from './home-credit-card-item/home-credit-card-item.component';

@Component({
  selector: 'app-home-credit-cards-list-widget',
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatDividerModule,
    RouterModule,
    HomeCreditCardItemComponent,
  ],
  templateUrl: './home-credit-cards-list-widget.component.html',
  styleUrl: './home-credit-cards-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCreditCardsListWidget implements OnInit {
  public readonly currency = input.required<string>();

  public readonly cardsList = signal<HomeCreditCard[]>([]);

  finishedFetch = signal(false);
  errorFetching = signal(false);

  constructor(private readonly _homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this._homeService
      .getCreditCardsList()
      .then((response) => this.cardsList.set(response))
      .catch(() => this.errorFetching.set(true))
      .finally(() => this.finishedFetch.set(true));
  }

  isntLastItem(index: number) {
    return index !== this.cardsList().length - 1;
  }
}
