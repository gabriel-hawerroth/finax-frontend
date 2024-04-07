import { Pipe, PipeTransform, inject } from '@angular/core';
import { UtilsService } from '../../utils/utils.service';

@Pipe({
  name: 'releasesMonth',
  standalone: true,
})
export class ReleasesMonthPipe implements PipeTransform {
  private _utilsService = inject(UtilsService);

  private currentYear = new Date().getFullYear().toString();

  transform(date: Date): string {
    const month = date.toLocaleString(
      this._utilsService.getUserConfigs.language,
      { month: 'long' }
    );

    const year = date.getFullYear().toString();

    return year === this.currentYear ? month : `${month} ${year}`;
  }
}
