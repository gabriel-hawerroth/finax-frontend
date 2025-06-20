import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-public-five-section',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './public-five-section.component.html',
  styleUrl: './public-five-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFiveSectionComponent implements AfterViewInit {
  private readonly _utilsService = inject(UtilsService);

  ngAfterViewInit(): void {
    this._utilsService.addInViewAnimation('.appear-in-view');
  }
}
