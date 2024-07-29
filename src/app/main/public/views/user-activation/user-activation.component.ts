import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    TranslateModule,
    ButtonsComponent,
  ],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivationPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

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
