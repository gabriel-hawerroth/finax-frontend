import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReleasesByCategoryPage } from '../releases-by-category/releases-by-category.component';

@Component({
  selector: 'app-mobile-reports',
  imports: [ReleasesByCategoryPage],
  templateUrl: './mobile-reports.component.html',
  styleUrl: './mobile-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileReportsPage {}
