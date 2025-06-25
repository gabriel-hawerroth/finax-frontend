import { inject, isDevMode } from '@angular/core';
import { TraceService } from '@sentry/angular';
import { ThemingService } from '../../shared/services/theming.service';
import {
  LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
  LS_SHOW_VALUES,
} from '../../shared/utils/local-storage-contants';
import { UtilsService } from '../../shared/utils/utils.service';
import { ShowValues } from '../enums/show-values';
import { SpendByCategoryInterval } from '../enums/spend-by-category-interval';

export default async function appInitializer(
  _utils = inject(UtilsService),
  _themingService = inject(ThemingService)
): Promise<void> {
  if (!isDevMode()) inject(TraceService);

  _themingService.applyTheme(_utils.getUserConfigs.theme);
  _utils.setUserConfigs(_utils.getUserConfigs);

  setDefaults(_utils);
}

function setDefaults(_utils: UtilsService) {
  _utils.setDefaultLanguage();

  if (!_utils.getItemLocalStorage(LS_SHOW_VALUES))
    _utils.setItemLocalStorage(LS_SHOW_VALUES, ShowValues.ON);

  if (!_utils.getItemLocalStorage(LS_DATE_INTERVAL_SPENDS_BY_CATEGORY))
    _utils.setItemLocalStorage(
      LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
      SpendByCategoryInterval.LAST_30_DAYS
    );
}
