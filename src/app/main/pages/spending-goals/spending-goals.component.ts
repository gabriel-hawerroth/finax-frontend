import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-spending-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-goals.component.html',
  styleUrl: './spending-goals.component.scss',
})
export class SpendingGoalsComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
