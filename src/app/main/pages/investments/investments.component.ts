import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
