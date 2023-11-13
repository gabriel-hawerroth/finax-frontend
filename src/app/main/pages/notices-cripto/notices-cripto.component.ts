import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-notices-cripto',
  templateUrl: './notices-cripto.component.html',
  styleUrls: ['./notices-cripto.component.scss'],
})
export class NoticesCriptoComponent implements OnInit {
  language = '';

  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {
    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value.language;
    });
  }
}
