import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-international-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './international-notices.component.html',
  styleUrl: './international-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalNoticesPage implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
