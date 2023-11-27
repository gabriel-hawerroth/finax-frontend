import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../../../utils/utils.service';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatButtonModule, RouterModule],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss',
})
export class UserActivationComponent implements OnInit {
  private _utilsService = inject(UtilsService);
  private _router = inject(Router);

  ngOnInit(): void {
    if (
      this._utilsService.isBrowser &&
      window.innerWidth <= 870 &&
      window.innerHeight <= 1230
    ) {
      this._utilsService.showSimpleMessageWithoutDuration(
        'Conta ativada com sucesso'
      );
      this._router.navigate(['']);
    }
  }
}
