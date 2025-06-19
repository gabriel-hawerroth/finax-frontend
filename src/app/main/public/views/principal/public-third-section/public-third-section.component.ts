import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-public-third-section',
  imports: [MatListModule],
  templateUrl: './public-third-section.component.html',
  styleUrl: './public-third-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicThirdSectionComponent {
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
