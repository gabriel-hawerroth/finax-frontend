import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import * as Sentry from '@sentry/angular';

Sentry.init({
  dsn: 'https://35e69f69f3ded8d048f3ba388a02d8d6@o4509481439330304.ingest.us.sentry.io/4509481442344960',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
