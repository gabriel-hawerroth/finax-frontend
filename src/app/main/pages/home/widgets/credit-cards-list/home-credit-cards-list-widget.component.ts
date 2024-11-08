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
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { HomeCreditCardItemComponent } from './home-credit-card-item/home-credit-card-item.component';

@Component({
  selector: 'app-home-credit-cards-list-widget',
  standalone: true,
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

  constructor(
    private readonly _homeService: HomeService,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    this._homeService
      .getCreditCardsList()
      .then((response) => {
        this.cardsList.set(response);
      })
      .catch(() => this._utils.showMessage('home.error-getting-credit-cards'));
  }

  public isntLastItem(index: number) {
    return index !== this.cardsList().length - 1;
  }
}
