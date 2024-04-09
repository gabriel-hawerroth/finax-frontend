import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-spending-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-goals.component.html',
  styleUrl: './spending-goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpendingGoalsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
