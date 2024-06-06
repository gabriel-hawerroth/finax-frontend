import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../utils/utils.service';

@Pipe({
  name: 'releasesMonth',
  standalone: true,
})
export class ReleasesMonthPipe implements PipeTransform {
  private readonly currentYear = new Date().getFullYear().toString();

  constructor(private _utils: UtilsService) {}

  transform(date: Date): string {
    const month = date.toLocaleString(this._utils.getUserConfigs.language, {
      month: 'long',
    });

    const year = date.getFullYear().toString();

    return year === this.currentYear ? month : `${month} ${year}`;
  }
}
