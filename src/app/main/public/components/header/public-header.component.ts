import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  constructor(public loginService: LoginService) {}
}
