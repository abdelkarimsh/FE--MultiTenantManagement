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
  tenantId?: string;
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
  version?: number;
  customerId: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  items?: OrderItemDto[];
  listItems?: OrderItemDto[];
  statusHistory: OrderStatusHistoryDto[];
}

export interface OrderListItemDto {
  id: string;
  tenantId: string;
  version?: number;
  customerId: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export type OrderListItem = OrderListItemDto;

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
  productVersion: number;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
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
  productVersion?: number;
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
