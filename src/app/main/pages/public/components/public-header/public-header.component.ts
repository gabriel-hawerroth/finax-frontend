import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../../../services/login.service';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [NgOptimizedImage, MatButtonModule, RouterModule],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeaderComponent {
  public loginService = inject(LoginService);
}
