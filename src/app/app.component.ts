import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { LoginService } from './services/login.service';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);
  location = inject(Location);

  title = 'finax-front';

  ngOnInit(): void {
    // test request to validate that the user is still logged
    this.loginService.stillLoggedTest();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler($event: any) {}
}
