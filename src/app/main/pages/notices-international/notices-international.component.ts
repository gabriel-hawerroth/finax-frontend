import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-notices-international',
  templateUrl: './notices-international.component.html',
  styleUrls: ['./notices-international.component.scss'],
})
export class NoticesInternationalComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
