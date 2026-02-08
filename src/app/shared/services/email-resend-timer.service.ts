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

const STORAGE_KEY_PREFIX = 'finax_email_resend_timer';
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

  private storageKey(flowType: ResendEmailFlowType): string {
    return `${STORAGE_KEY_PREFIX}_${flowType}`;
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
  canResend(flowType: ResendEmailFlowType): boolean {
    if (!this.isBrowser) return false;

    const state = this.getTimerState(flowType);
    if (!state) return false;

    // Check if blocked
    if (this.isBlocked(flowType)) return false;

    // Check if timer has expired
    const now = new Date().getTime();
    const nextResendTime = new Date(state.nextResendAvailableAt).getTime();

    return now >= nextResendTime;
  }

  /**
   * Get remaining time in seconds until resend is available
   */
  getRemainingTime(flowType: ResendEmailFlowType): number {
    if (!this.isBrowser) return 0;

    const state = this.getTimerState(flowType);
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
  incrementAttempt(flowType: ResendEmailFlowType): void {
    if (!this.isBrowser) return;

    const state = this.getTimerState(flowType);
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
  isBlocked(flowType: ResendEmailFlowType): boolean {
    if (!this.isBrowser) return false;

    const state = this.getTimerState(flowType);
    if (!state || !state.blockedUntil) return false;

    const now = new Date().getTime();
    const blockExpiry = new Date(state.blockedUntil).getTime();

    // If block has expired, reset the state
    if (now >= blockExpiry) {
      this.resetFlow(flowType);
      return false;
    }

    return true;
  }

  /**
   * Clear timer state for a specific flow
   */
  resetFlow(flowType: ResendEmailFlowType): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.storageKey(flowType));
  }

  /**
   * Clear timer state for all flows
   */
  reset(): void {
    if (!this.isBrowser) return;
    for (const flow of Object.values(ResendEmailFlowType)) {
      localStorage.removeItem(this.storageKey(flow));
    }
  }

  /**
   * Get current state from localStorage
   */
  getTimerState(flowType: ResendEmailFlowType): ResendTimerState | null {
    if (!this.isBrowser) return null;

    try {
      const stored = localStorage.getItem(this.storageKey(flowType));
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
        this.resetFlow(flowType);
        return null;
      }

      // Validate attemptCount is a finite integer within expected range (0–2)
      const attemptCount = Number(state.attemptCount);
      if (
        !Number.isFinite(attemptCount) ||
        !Number.isInteger(attemptCount) ||
        attemptCount < 0 ||
        attemptCount > 2
      ) {
        this.resetFlow(flowType);
        return null;
      }

      // Validate timestamps parse to valid dates
      const createdAtMs = Date.parse(state.createdAt);
      const nextResendMs = Date.parse(state.nextResendAvailableAt);
      const blockedUntilMs =
        state.blockedUntil !== undefined ? Date.parse(state.blockedUntil) : null;

      if (
        Number.isNaN(createdAtMs) ||
        Number.isNaN(nextResendMs) ||
        (blockedUntilMs !== null && Number.isNaN(blockedUntilMs))
      ) {
        this.resetFlow(flowType);
        return null;
      }

      return state;
    } catch {
      this.resetFlow(flowType);
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

    const state = this.getTimerState(flowType);
    if (!state) return false;

    return state.email === email && state.flowType === flowType;
  }

  /**
   * Save state to localStorage
   */
  private saveTimerState(state: ResendTimerState): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.storageKey(state.flowType), JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }
}
