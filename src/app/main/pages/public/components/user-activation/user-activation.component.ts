import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../../../utils/utils.service';
import { TranslateModule } from '@ngx-translate/core';

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
export class UserActivationComponent implements OnInit {
  private _utilsService = inject(UtilsService);
  private _router = inject(Router);

  ngOnInit(): void {
    if (
      this._utilsService.isBrowser &&
      window.innerWidth <= 870 &&
      window.innerHeight <= 1230
    ) {
      this._utilsService.showMessageWithoutDuration('user-activation.title');
      this._router.navigate(['']);
    }
  }
}
