import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-notices-cripto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices-cripto.component.html',
  styleUrl: './notices-cripto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesCriptoComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
