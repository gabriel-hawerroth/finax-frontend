import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { getBtnStyle } from '../../../../shared/utils/constant-utils';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-account-canceled',
  standalone: true,
  imports: [ButtonsComponent, RouterModule, MatCardModule],
  templateUrl: './account-canceled.component.html',
  styleUrl: './account-canceled.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCanceledPage implements OnInit {
  getBtnStyle = getBtnStyle;

  constructor(private readonly _loginService: LoginService) {}

  ngOnInit(): void {
    if (this._loginService.logged) this._loginService.logout(false, false);
  }
}
