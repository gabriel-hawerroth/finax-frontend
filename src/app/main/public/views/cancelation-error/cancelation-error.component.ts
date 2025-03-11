import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { getBtnStyle } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-cancelation-error',
  imports: [
    CommonModule,
    ButtonsComponent,
    RouterModule,
    MatCardModule,
    TranslateModule,
  ],
  templateUrl: './cancelation-error.component.html',
  styleUrl: './cancelation-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelationErrorPage implements OnInit {
  getBtnStyle = getBtnStyle;

  constructor(private readonly _loginService: LoginService) {}

  ngOnInit(): void {
    if (this._loginService.logged) this._loginService.logout(false, false);
  }
}
