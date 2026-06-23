import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import { queryKeys } from '../../api/queryKeys';

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn:  dashboardApi.getSummary,
    staleTime: 60_000, // 1 min — dashboard data doesn't need real-time refresh
  });
}

export function useMonthlyOrders(year: number) {
  return useQuery({
    queryKey: queryKeys.dashboard.monthlyOrders(year),
    queryFn:  () => dashboardApi.getMonthlyOrders(year),
    staleTime: 60_000,
  });
}
