import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { HomeCreditCardItemComponent } from './home-credit-card-item/home-credit-card-item.component';

@Component({
  selector: 'app-home-credit-cards-list-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    MatDividerModule,
    RouterModule,
    ButtonsComponent,
    HomeCreditCardItemComponent,
  ],
  templateUrl: './home-credit-cards-list-widget.component.html',
  styleUrl: './home-credit-cards-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCreditCardsListWidget implements OnInit {
  public readonly currency = input.required<string>();

  public readonly cardsList = signal<HomeCreditCard[]>([]);

  constructor(private readonly _homeService: HomeService) {}

  ngOnInit(): void {
    this._homeService.getCreditCardsList().then((response) => {
      this.cardsList.set(response);
    });
  }

  public isntLastItem(index: number) {
    return index !== this.cardsList().length - 1;
  }
}
