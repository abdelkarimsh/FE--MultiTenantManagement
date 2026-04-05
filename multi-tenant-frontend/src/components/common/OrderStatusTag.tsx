import React from 'react';
import { Tag } from 'antd';
import { ORDER_STATUSES, type OrderStatus } from '../../types/order';

const ORDER_STATUS_COLORS: Record<string, string> = {
  [ORDER_STATUSES.pendingApproval]: 'gold',
  [ORDER_STATUSES.approved]: 'green',
  [ORDER_STATUSES.rejected]: 'red',
  [ORDER_STATUSES.cancelled]: 'default',
};

interface OrderStatusTagProps {
  status: OrderStatus;
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status }) => {
  return <Tag color={ORDER_STATUS_COLORS[status] || 'blue'}>{status}</Tag>;
};

export default OrderStatusTag;

