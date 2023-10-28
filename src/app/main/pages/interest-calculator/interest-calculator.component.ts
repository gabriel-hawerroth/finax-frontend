import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-interest-calculator',
  templateUrl: './interest-calculator.component.html',
  styleUrls: ['./interest-calculator.component.scss'],
})
export class InterestCalculatorComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
