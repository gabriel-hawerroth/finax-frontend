import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { UtilsService } from '../../../utils/utils.service';

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
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
})
export class PublicComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  public el = inject(ElementRef);
  private _fb = inject(FormBuilder);

  switchPlansForm!: FormGroup;
  isPcScreen: boolean = this.utilsService.isPcScreen;
  showScrollTop: boolean = false;

  ngOnInit(): void {
    this.buildForm();
    if (this.isPcScreen) this.validateByScreenSize();
  }

  buildForm() {
    this.switchPlansForm = this._fb.group({
      planSwitch: false,
    });
  }

  validateByScreenSize() {
    if (this.utilsService.isBrowser) {
      window.onscroll = () => {
        this.showScrollTop = document.documentElement.scrollTop > 600;
      };
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

  scrollTo(elementId: string) {
    var target = document.getElementById(elementId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
    }
  }
}
