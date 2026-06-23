import httpClient from './httpClient';
import type { DashboardSummaryDto, MonthlyOrderDto } from '../types/dashboard';

export const dashboardApi = {
  getSummary: (): Promise<DashboardSummaryDto> =>
    httpClient.get<DashboardSummaryDto>('/dashboard/summary').then(r => r.data),

  getMonthlyOrders: (year: number): Promise<MonthlyOrderDto[]> =>
    httpClient
      .get<MonthlyOrderDto[]>('/dashboard/monthly-orders', { params: { year } })
      .then(r => r.data),
};
