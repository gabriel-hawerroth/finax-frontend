import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { isAfter } from 'date-fns';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../shared/utils/utils.service';
import { PublicFooterComponent } from '../../components/footer/public-footer.component';
import { PublicHeaderComponent } from '../../components/header/public-header.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    RouterModule,
    PublicHeaderComponent,
    PublicFooterComponent,
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  showScrollTop: boolean = false;

  switchPlansControl!: FormControl;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _el: ElementRef
  ) {}

  ngOnInit(): void {
    this.switchPlansControl = new FormControl(false);

    if (
      isAfter(
        new Date(),
        this._utils.getItemLocalStorage('tokenExpiration') || new Date()
      )
    ) {
      this._loginService.logout(false);
    }
  }

  get getWidth(): number {
    const width = +this._el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientWidth;

    return (80 / 100) * width + 1;
  }

  get getHeight(): number {
    const height = +this._el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientHeight;

    return (80 / 100) * height + 1;
  }

  get getSecondWidth(): number {
    const width = +this._el.nativeElement.querySelector(
      '[id="ss-img-container"]'
    ).clientWidth;

    return (80 / 100) * width + 1;
  }

  get getSecondHeight(): number {
    const height = +this._el.nativeElement.querySelector(
      '[id="ss-img-container"]'
    ).clientHeight;

    return (67 / 100) * height + 1;
  }
}
