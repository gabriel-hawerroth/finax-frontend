import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-public-third-section',
  imports: [MatListModule],
  templateUrl: './public-third-section.component.html',
  styleUrl: './public-third-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicThirdSectionComponent implements AfterViewInit {
  private readonly _utilsService = inject(UtilsService);

  ngAfterViewInit(): void {
    this._utilsService.addInViewAnimation(
      '.fade-in-left-in-view, .fade-in-right-in-view'
    );
  }

  cards = signal<ThirdSectionCard[]>([
    {
      icon: 'credit_card',
      iconBackgroundColor: '#009cbf',
      title: 'Transações',
      description: 'Controle completo',
    },
    {
      icon: 'savings',
      iconBackgroundColor: '#00bf2d',
      title: 'Economia',
      description: 'Metas inteligentes',
    },
    {
      icon: 'bar_chart',
      iconBackgroundColor: '#a600bf',
      title: 'Análises',
      description: 'Insights com IA',
    },
    {
      icon: 'trending_up',
      iconBackgroundColor: '#e47f04',
      title: 'Investimentos',
      description: 'Acompanhamento',
    },
  ]);
}

interface ThirdSectionCard {
  icon: string;
  iconBackgroundColor: string;
  title: string;
  description: string;
}
