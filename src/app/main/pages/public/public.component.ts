import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { UtilsService } from '../../../utils/utils.service';
import moment from 'moment';
import { PublicHeaderComponent } from '../../public-header/public-header.component';
import { PublicFooterComponent } from '../../public-footer/public-footer.component';

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
export class PublicComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  public el = inject(ElementRef);

  showScrollTop: boolean = false;

  switchPlansControl: FormControl = new FormControl(false);

  ngOnInit(): void {
    if (
      moment().isAfter(this.utilsService.getItemLocalStorage('tokenExpiration'))
    ) {
      this.loginService.logout(false);
    }
  }

  get getWidth(): number {
    const width = +this.el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientWidth;

    return (80 / 100) * width + 1;
  }

  get getHeight(): number {
    const height = +this.el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientHeight;

    return (80 / 100) * height + 1;
  }

  get getSecondWidth(): number {
    const width = +this.el.nativeElement.querySelector(
      '[id="ss-img-container"]'
    ).clientWidth;

    return (80 / 100) * width + 1;
  }

  get getSecondHeight(): number {
    const height = +this.el.nativeElement.querySelector(
      '[id="ss-img-container"]'
    ).clientHeight;

    return (67 / 100) * height + 1;
  }
}
