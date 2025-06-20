import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-public-fourth-section',
  imports: [MatListModule, MatButtonModule, RouterModule],
  templateUrl: './public-fourth-section.component.html',
  styleUrl: './public-fourth-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFourthSectionComponent implements AfterViewInit {
  private readonly _utilsService = inject(UtilsService);

  ngAfterViewInit(): void {
    this._utilsService.addInViewAnimation('.fade-in-down-in-view');
  }
}
