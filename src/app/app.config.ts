import { DatePipe, registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Sentry from '@sentry/angular';
import {
  NgxCurrencyInputMode,
  provideEnvironmentNgxCurrency,
} from 'ngx-currency-v2';
import { routes } from './app.routes';
import { CustomErrorHandler } from './core/handlers/custom-error.handler';
import appInitializer from './core/initializers/app.initializer';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

export const APP_LANGUAGE = 'pt-BR';

registerLocaleData(localePt, APP_LANGUAGE);

const sentryProviders = isDevMode()
  ? []
  : [
      {
        provide: ErrorHandler,
        useClass: CustomErrorHandler,
      },
      {
        provide: Sentry.TraceService,
        deps: [Router],
      },
    ];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withIncrementalHydration(), withEventReplay()),
    provideAnimations(),
    provideNativeDateAdapter(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideEnvironmentNgxCurrency({
      align: 'right',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 2,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: false,
      min: null,
      max: 999999999999.99,
      inputMode: NgxCurrencyInputMode.Financial,
    }),
    provideTranslateService({
      lang: APP_LANGUAGE,
      fallbackLang: APP_LANGUAGE,
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
        useHttpBackend: true,
      }),
    }),
    { provide: MAT_DATE_LOCALE, useValue: APP_LANGUAGE },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: 'TIMEZONE', useValue: 'America/Sao_Paulo' },
    DatePipe,
    ...sentryProviders,
    provideAppInitializer(appInitializer),
  ],
};
