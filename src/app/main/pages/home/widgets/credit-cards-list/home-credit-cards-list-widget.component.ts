import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { HomeService } from '../../../../../core/entities/home-p/home.service';

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
  ],
  templateUrl: './home-credit-cards-list-widget.component.html',
  styleUrl: './home-credit-cards-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCreditCardsListWidget implements OnInit {
  constructor(private _homeService: HomeService) {}

  ngOnInit(): void {
    this._homeService.getCreditCardsList().then((response) => {
      console.log(response);
      
    })
  }
}
