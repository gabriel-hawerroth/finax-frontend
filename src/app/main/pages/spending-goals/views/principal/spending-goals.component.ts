import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-spending-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-goals.component.html',
  styleUrl: './spending-goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpendingGoalsComponent implements OnInit {
  constructor(public readonly utils: UtilsService) {}

  ngOnInit(): void {}
}
