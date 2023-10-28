import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-spending-goals',
  templateUrl: './spending-goals.component.html',
  styleUrls: ['./spending-goals.component.scss'],
})
export class SpendingGoalsComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
