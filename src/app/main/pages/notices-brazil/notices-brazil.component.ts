import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-notices-brazil',
  templateUrl: './notices-brazil.component.html',
  styleUrls: ['./notices-brazil.component.scss'],
})
export class NoticesBrazilComponent implements OnInit {
  language = 'pt-br';

  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {
    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value.language;
    });
  }
}
