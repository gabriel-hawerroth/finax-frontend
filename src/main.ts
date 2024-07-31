import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  if (window) {
    window.console.log = function () {};
    window.console.warn = function () {};
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
