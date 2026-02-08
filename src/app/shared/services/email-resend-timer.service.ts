import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

export enum ResendEmailFlowType {
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export interface ResendTimerState {
  email: string;
  flowType: ResendEmailFlowType;
  attemptCount: number;
  nextResendAvailableAt: string; // ISO timestamp
  blockedUntil?: string; // ISO timestamp for 1-hour block
  createdAt: string; // ISO timestamp
}

const STORAGE_KEY = 'finax_email_resend_timer';
const FIRST_WAIT_TIME = 2 * 60 * 1000; // 2 minutes in ms
const SECOND_WAIT_TIME = 3 * 60 * 1000; // 3 minutes in ms
const BLOCK_TIME = 60 * 60 * 1000; // 1 hour in ms

@Injectable({
  providedIn: 'root',
})
export class EmailResendTimerService {
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  /**
   * Initialize timer after first email send
   */
  startTimer(email: string, flowType: ResendEmailFlowType): void {
    if (!this.isBrowser) return;

    const now = new Date();
    const state: ResendTimerState = {
      email,
      flowType,
      attemptCount: 0,
      nextResendAvailableAt: new Date(
        now.getTime() + FIRST_WAIT_TIME
      ).toISOString(),
      createdAt: now.toISOString(),
    };

    this.saveTimerState(state);
  }

  /**
   * Check if resend is currently allowed
   */
  canResend(): boolean {
    if (!this.isBrowser) return false;

    const state = this.getTimerState();
    if (!state) return false;

    // Check if blocked
    if (this.isBlocked()) return false;

    // Check if timer has expired
    const now = new Date().getTime();
    const nextResendTime = new Date(state.nextResendAvailableAt).getTime();

    return now >= nextResendTime;
  }

  /**
   * Get remaining time in seconds until resend is available
   */
  getRemainingTime(): number {
    if (!this.isBrowser) return 0;

    const state = this.getTimerState();
    if (!state) return 0;

    // If blocked, return time until block expires
    if (state.blockedUntil) {
      const now = new Date().getTime();
      const blockExpiry = new Date(state.blockedUntil).getTime();
      const remaining = Math.max(0, Math.ceil((blockExpiry - now) / 1000));
      return remaining;
    }

    const now = new Date().getTime();
    const nextResendTime = new Date(state.nextResendAvailableAt).getTime();
    const remaining = Math.max(0, Math.ceil((nextResendTime - now) / 1000));

    return remaining;
  }

  /**
   * Increment attempt counter and set next timer
   */
  incrementAttempt(): void {
    if (!this.isBrowser) return;

    const state = this.getTimerState();
    if (!state) return;

    const now = new Date();
    state.attemptCount += 1;

    if (state.attemptCount === 1) {
      // First resend - set 3-minute timer
      state.nextResendAvailableAt = new Date(
        now.getTime() + SECOND_WAIT_TIME
      ).toISOString();
    } else if (state.attemptCount >= 2) {
      // Second resend - set 1-hour block
      state.blockedUntil = new Date(now.getTime() + BLOCK_TIME).toISOString();
      state.nextResendAvailableAt = state.blockedUntil;
    }

    this.saveTimerState(state);
  }

  /**
   * Check if in 1-hour block period
   */
  isBlocked(): boolean {
    if (!this.isBrowser) return false;

    const state = this.getTimerState();
    if (!state || !state.blockedUntil) return false;

    const now = new Date().getTime();
    const blockExpiry = new Date(state.blockedUntil).getTime();

    // If block has expired, reset the state
    if (now >= blockExpiry) {
      this.resetAfterBlock();
      return false;
    }

    return true;
  }

  /**
   * Reset timer state after 1-hour block expires
   */
  private resetAfterBlock(): void {
    this.reset();
  }

  /**
   * Clear timer state completely
   */
  reset(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get current state from localStorage
   */
  getTimerState(): ResendTimerState | null {
    if (!this.isBrowser) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored) as ResendTimerState;

      // Validate state structure
      if (
        !state.email ||
        !state.flowType ||
        state.attemptCount === undefined ||
        !state.nextResendAvailableAt ||
        !state.createdAt
      ) {
        this.reset();
        return null;
      }

      return state;
    } catch {
      this.reset();
      return null;
    }
  }

  /**
   * Check if timer state exists for given email and flow
   */
  hasTimerForEmailAndFlow(
    email: string,
    flowType: ResendEmailFlowType
  ): boolean {
    if (!this.isBrowser) return false;

    const state = this.getTimerState();
    if (!state) return false;

    return state.email === email && state.flowType === flowType;
  }

  /**
   * Save state to localStorage
   */
  private saveTimerState(state: ResendTimerState): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify(state),
          url: window.location.href,
        })
      );
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }
}
