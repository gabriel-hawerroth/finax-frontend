import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-report-investments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-investments.component.html',
  styleUrl: './report-investments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportInvestmentsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
