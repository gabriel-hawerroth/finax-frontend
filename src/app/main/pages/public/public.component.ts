import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  switchPlansForm!: FormGroup;

  constructor(
    private _router: Router,
    private _loginService: LoginService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.validateByScreenSize();
  }

  buildForm() {
    this.switchPlansForm = this._fb.group({
      planSwitch: false,
    });
  }

  validateByScreenSize() {
    if (window.innerWidth >= 1100 && window.innerHeight >= 600) {
      window.onscroll = () => {
        var scrollButton = document.getElementById('back-to-top');
        if (
          document.body.scrollTop > 600 ||
          document.documentElement.scrollTop > 600
        ) {
          scrollButton!.style.display = 'block';
        } else {
          scrollButton!.style.display = 'none';
        }
      };
    }
  }

  navigateLogin() {
    if (this._loginService.logged) this._router.navigate(['home']);
    else this._router.navigate(['login']);
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
