import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'privacy-policy-page',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPage {}
