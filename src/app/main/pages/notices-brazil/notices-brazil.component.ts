import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-notices-brazil',
  templateUrl: './notices-brazil.component.html',
  styleUrls: ['./notices-brazil.component.scss'],
})
export class NoticesBrazilComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
