import { Signal } from '@angular/core';
import { ChartData } from 'chart.js';

export interface ReleasesReportData<T> {
  releaseType: 'Category' | 'Account';
  localStorageKey: string;

  // Data sources
  releasesData: Signal<T[]>;
  chartData: Signal<ChartData>;

  // Methods to implement
  fetchReleases: (params: any) => Promise<void>;
  getChartData: (list: T[]) => ChartData;
}
