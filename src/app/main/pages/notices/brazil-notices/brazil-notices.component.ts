import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-brazil-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brazil-notices.component.html',
  styleUrl: './brazil-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrazilNoticesPage implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
