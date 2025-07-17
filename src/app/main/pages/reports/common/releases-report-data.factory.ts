import { Signal, signal } from '@angular/core';
import { ChartData } from 'chart.js';
import {
  ReleasesByAccount,
  ReleasesByCategory,
  ReportReleasesByParams,
} from '../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../core/entities/reports/reports.service';
import { ReleasesReportData } from './releases-report-data.interface';

export class ReleasesReportDataFactory {
  static createCategoryReportData(
    reportsService: ReportsService,
    localStorageKey: string
  ): ReleasesReportData<ReleasesByCategory> {
    const releasesData = signal<ReleasesByCategory[]>([]);
    const chartData = signal<ChartData>({
      labels: [],
      datasets: [],
    });

    const getChartData = (list: ReleasesByCategory[]): ChartData => {
      return {
        datasets: [
          {
            data: list.map((item) => item.value),
            backgroundColor: list.map((item) => item.category.color),
            borderColor: '#dededeea',
          },
        ],
        labels: list.map((item) => item.category.name),
      };
    };

    const fetchReleases = async (
      params: ReportReleasesByParams
    ): Promise<void> => {
      try {
        const response = await reportsService.getReleasesByCategory(params);
        releasesData.set(response);
        chartData.set(getChartData(response));
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    };

    return {
      releaseType: 'Category',
      localStorageKey,
      releasesData: releasesData as Signal<ReleasesByCategory[]>,
      chartData: chartData,
      fetchReleases,
      getChartData,
    };
  }

  static createAccountReportData(
    reportsService: ReportsService,
    localStorageKey: string
  ): ReleasesReportData<ReleasesByAccount> {
    const releasesData = signal<ReleasesByAccount[]>([]);
    const chartData = signal<ChartData>({
      labels: [],
      datasets: [],
    });

    const PIE_CHART_COLORS: string[] = [
      '#36a3eb94', // Azul claro
      '#2ecc4094', // Verde forte
      '#E74C3C94', // Vermelho intenso
      '#4BC0C094', // Verde água
      '#FF638494', // Rosa vibrante
      '#9966FF94', // Roxo suave
      '#FFCE5694', // Amarelo dourado
      '#FF9F4094', // Laranja
      '#C9CBCF94', // Cinza claro
      '#F1C40F94', // Amarelo vivo
    ];

    const getChartData = (list: ReleasesByAccount[]): ChartData => {
      return {
        datasets: [
          {
            data: list.map((item) => item.value),
            backgroundColor: list.map(
              (item, index) => PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]
            ),
            borderColor: '#dededeea',
          },
        ],
        labels: list.map((item) => item.accountName),
      };
    };

    const fetchReleases = async (
      params: ReportReleasesByParams
    ): Promise<void> => {
      try {
        const response = await reportsService.getReleasesByAccount(params);
        releasesData.set(response);
        chartData.set(getChartData(response));
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    };

    return {
      releaseType: 'Account',
      localStorageKey,
      releasesData: releasesData as Signal<ReleasesByAccount[]>,
      chartData,
      fetchReleases,
      getChartData,
    };
  }
}
