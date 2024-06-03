import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../../utils/utils.service';

@Component({
  selector: 'app-cripto-notices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cripto-notices.component.html',
  styleUrl: './cripto-notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriptoNoticesPage implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
