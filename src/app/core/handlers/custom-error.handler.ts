import { ErrorHandler, Injectable } from '@angular/core';
import { createErrorHandler } from '@sentry/angular';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  private sentryErrorHandler = createErrorHandler();

  handleError(error: any): void {
    if (error?.skipSentry || error?.rejection?.skipSentry) return;

    this.sentryErrorHandler.handleError(error);
  }
}
