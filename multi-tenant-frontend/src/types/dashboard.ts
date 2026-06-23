export interface TopProductDto {
  name:     string;
  quantity: number;
}

export interface DashboardSummaryDto {
  totalSales:     number;
  totalOrders:    number;
  approvedOrders: number;
  pendingOrders:  number;
  topProduct:     TopProductDto | null;
}

export interface MonthlyOrderDto {
  month:  string;
  orders: number;
}
