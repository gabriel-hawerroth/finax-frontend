import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-interest-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interest-calculator.component.html',
  styleUrl: './interest-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestCalculatorComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
