import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { AbstractReleasesReportComponent } from '../../common/abstract-releases-report.component';
import { ReleasesReportData } from '../../common/releases-report-data.interface';
import { ReleasesByCardComponent } from '../releases-by-card/releases-by-card.component';

@Component({
  selector: 'app-releases-report',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DynamicButtonComponent,
    ReleasesByCardComponent,
    ReleasesMonthPipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonToggleModule,
  ],
  templateUrl: './releases-report.component.html',
  styleUrls: ['./releases-report.component.scss'],
})
export class ReleasesReportComponent extends AbstractReleasesReportComponent {
  titleTranslationKey = input.required<string>();
  expensesData = input.required<ReleasesReportData<any>>();
  revenuesData = input.required<ReleasesReportData<any>>();
  defaultChartType = input.required<'pie' | 'bar'>();
}
