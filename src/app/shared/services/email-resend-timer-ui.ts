import { signal } from '@angular/core';
import {
    EmailResendTimerService,
    ResendEmailFlowType,
} from './email-resend-timer.service';

export class EmailResendTimerUI {
  readonly resendAvailable = signal(false);
  readonly remainingTime = signal(0);
  readonly isBlocked = signal(false);
  readonly resendAttempts = signal(0);

  private timerInterval?: ReturnType<typeof setInterval>;
  private _onBlockExpired?: () => void;

  constructor(
    private readonly timerService: EmailResendTimerService,
    private readonly flowType: ResendEmailFlowType
  ) {}

  checkExistingState(): string | null {
    const state = this.timerService.getTimerState();
    if (state && state.flowType === this.flowType) {
      return state.email;
    }
    return null;
  }

  startNewTimer(email: string): void {
    this.timerService.startTimer(email, this.flowType);
    this.updateUI();
    this.startInterval();
  }

  onResendSuccess(): void {
    this.timerService.incrementAttempt();
    this.updateUI();
    this.startInterval();
  }

  canResend(): boolean {
    return this.timerService.canResend();
  }

  setOnBlockExpired(callback: () => void): void {
    this._onBlockExpired = callback;
  }

  reset(): void {
    this.timerService.reset();
  }

  startInterval(): void {
    this.clearInterval();
    this.timerInterval = setInterval(() => this.updateUI(), 1000);
  }

  clearInterval(): void {
    if (this.timerInterval) {
      globalThis.clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  updateUI(): void {
    const wasBlocked = this.isBlocked();

    const blocked = this.timerService.isBlocked();
    const state = this.timerService.getTimerState();

    if (!state) {
      this.resendAvailable.set(false);
      this.remainingTime.set(0);
      this.isBlocked.set(false);
      this.resendAttempts.set(0);
      this.clearInterval();

      if (wasBlocked) {
        this._onBlockExpired?.();
      }
      return;
    }

    const remaining = this.timerService.getRemainingTime();
    const canResend = this.timerService.canResend();

    this.remainingTime.set(remaining);
    this.resendAvailable.set(canResend);
    this.isBlocked.set(blocked);
    this.resendAttempts.set(state.attemptCount);

    if (remaining === 0 && !blocked) {
      this.clearInterval();
    }
  }

  formatTime(seconds: number): string {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  destroy(): void {
    this.clearInterval();
  }
}
