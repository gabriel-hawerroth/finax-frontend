import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public _loginService: LoginService, public _location: Location) {}

  ngOnInit(): void {
    // test request to validate that the user is still logged
    this._loginService.stillLoggedTest();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler($event: any) {}
}
