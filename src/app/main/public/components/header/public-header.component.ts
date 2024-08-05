import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [NgOptimizedImage, MatButtonModule, RouterModule],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeaderComponent {
  onNavigateToOurServices = output<void>();
  onNavigateToPlans = output<void>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  constructor(public loginService: LoginService) {}

  navigateToOurServices(): void {
    this.onNavigateToOurServices.emit();
  }

  navigateToPlans(): void {
    this.onNavigateToPlans.emit();
  }
}
