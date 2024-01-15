import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { LoginService } from './services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loginService = inject(LoginService);
  public location = inject(Location);

  ngOnInit(): void {}

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler($event: any) {}
}
