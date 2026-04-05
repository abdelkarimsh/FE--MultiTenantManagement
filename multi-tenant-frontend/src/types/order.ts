export const ORDER_STATUSES = {
  pendingApproval: 'PendingApproval',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES] | string;

export interface OrderStatusHistoryDto {
  id: string;
  fromStatus: string;
  toStatus: string;
  actionName: string;
  comment: string | null;
  changedBy: string;
  changedAtUtc: string;
}

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  productName?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
}

export interface OrderDto {
  id: string;
  tenantId: string;
  customerId: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  items?: OrderItemDto[];
  statusHistory: OrderStatusHistoryDto[];
}

export interface OrderListItem {
  id: string;
  tenantId: string;
  customerId: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface GetOrdersQuery {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isAscending?: boolean;
  search?: string;
  status?: string;
  customerId?: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  customerId: string;
  deliveryAddress: string;
  totalAmount: number;
  items: CreateOrderItemRequest[];
}

export interface CancelOrderRequest {
  reason: string;
}

export interface RejectOrderRequest {
  reason: string;
}

export interface CartItem {
  productId: string;
  tenantId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stockQuantity: number;
}

export const canTenantAdminManageOrder = (status: OrderStatus): boolean =>
  status === ORDER_STATUSES.pendingApproval;

export const canTenantUserCancelOrder = (status: OrderStatus): boolean =>
  status === ORDER_STATUSES.pendingApproval;
