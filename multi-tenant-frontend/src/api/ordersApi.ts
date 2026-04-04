import httpClient from './httpClient';
import type {
  CancelOrderRequest,
  CreateOrderRequest,
  OrderDto,
  OrderListItem,
  RejectOrderRequest,
  GetOrdersQuery,
} from '../types/order';
import type { PagedResult } from '../types/tenant';

const orderBasePath = (tenantId: string) => `/tenants/${tenantId}/orders`;

export const ordersApi = {
  getOrders: async (tenantId: string, query: GetOrdersQuery): Promise<PagedResult<OrderListItem>> => {
    const response = await httpClient.get<PagedResult<OrderListItem>>(orderBasePath(tenantId), {
      params: query,
    });
    return response.data;
  },

  createOrder: async (tenantId: string, payload: CreateOrderRequest): Promise<OrderDto> => {
    const response = await httpClient.post<OrderDto>(orderBasePath(tenantId), payload);
    return response.data;
  },

  getOrderById: async (tenantId: string, orderId: string): Promise<OrderDto> => {
    const response = await httpClient.get<OrderDto>(`${orderBasePath(tenantId)}/${orderId}`);
    return response.data;
  },

  cancelOrder: async (tenantId: string, orderId: string, payload: CancelOrderRequest): Promise<void> => {
    await httpClient.post(`${orderBasePath(tenantId)}/${orderId}/cancel`, payload);
  },

  approveOrder: async (tenantId: string, orderId: string): Promise<void> => {
    await httpClient.post(`${orderBasePath(tenantId)}/${orderId}/approve`);
  },

  rejectOrder: async (tenantId: string, orderId: string, payload: RejectOrderRequest): Promise<void> => {
    await httpClient.post(`${orderBasePath(tenantId)}/${orderId}/reject`, payload);
  },
};
