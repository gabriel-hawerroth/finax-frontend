import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-notices-brazil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices-brazil.component.html',
  styleUrl: './notices-brazil.component.scss',
})
export class NoticesBrazilComponent implements OnInit {
  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {}
}
