import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-notices-brazil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices-brazil.component.html',
  styleUrl: './notices-brazil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesBrazilComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
