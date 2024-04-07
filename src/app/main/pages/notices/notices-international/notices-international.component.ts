import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-notices-international',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notices-international.component.html',
  styleUrl: './notices-international.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesInternationalComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
