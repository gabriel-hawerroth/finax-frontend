import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/constants';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivationPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router
  ) {}

  ngOnInit(): void {
    if (
      this._utils.isBrowser &&
      window.innerWidth <= 870 &&
      window.innerHeight <= 1230
    ) {
      this._utils.showMessageWithoutDuration('user-activation.title');
      this._router.navigate(['']);
    }
  }
}
