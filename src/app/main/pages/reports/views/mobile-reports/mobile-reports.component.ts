import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { ReleasesByAccountPage } from '../releases-by-account/releases-by-account.component';
import { ReleasesByCategoryPage } from '../releases-by-category/releases-by-category.component';

@Component({
  selector: 'app-mobile-reports',
  imports: [
    TranslateModule,
    ReleasesByCategoryPage,
    ReleasesByAccountPage,
    DynamicButtonComponent,
  ],
  templateUrl: './mobile-reports.component.html',
  styleUrl: './mobile-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileReportsPage {
  private readonly REPORTS = ['releases-by-category', 'releases-by-account'];

  selectedReport = signal<string>(this.REPORTS[0]);

  navigateBackBtnConfig: ButtonConfig = {
    icon: 'chevron_left',
    type: ButtonType.ICON,
    disabled: false,
    onClick: () => this.changeReport('before'),
  };

  navigateNextBtnConfig: ButtonConfig = {
    icon: 'chevron_right',
    type: ButtonType.ICON,
    disabled: false,
    onClick: () => this.changeReport('next'),
  };

  private changeReport(direction: 'before' | 'next'): void {
    const currentIndex = this.REPORTS.indexOf(this.selectedReport());
    let newIndex = currentIndex;

    if (direction === 'before') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.REPORTS.length - 1;
    } else if (direction === 'next') {
      newIndex = currentIndex < this.REPORTS.length - 1 ? currentIndex + 1 : 0;
    }

    this.selectedReport.set(this.REPORTS[newIndex]);
  }
}
