import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-notices-international',
  templateUrl: './notices-international.component.html',
  styleUrls: ['./notices-international.component.scss'],
})
export class NoticesInternationalComponent implements OnInit {
  language = '';

  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {
    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value.language;
    });
  }
}
