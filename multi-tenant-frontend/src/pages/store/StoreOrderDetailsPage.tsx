import React from 'react';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Spin,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import { APP_ROLES, normalizeRole } from '../../types/auth';
import { ORDER_STATUSES } from '../../types/order';

interface CancelFormValues {
  reason: string;
}

const statusColorMap: Record<string, string> = {
  [ORDER_STATUSES.pendingApproval]: 'gold',
  [ORDER_STATUSES.approved]: 'green',
  [ORDER_STATUSES.rejected]: 'red',
  [ORDER_STATUSES.cancelled]: 'default',
};

const StoreOrderDetailsPage: React.FC = () => {
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [form] = Form.useForm<CancelFormValues>();
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();
  const { currentTenantId, user } = useAuth();
  const role = normalizeRole(user?.role);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.storeOrders.detail(currentTenantId, orderId ?? null),
    queryFn: () => ordersApi.getOrderById(currentTenantId as string, orderId as string),
    enabled: !!currentTenantId && !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) =>
      ordersApi.cancelOrder(currentTenantId as string, orderId as string, { reason }),
    onSuccess: async () => {
      message.success('Order cancelled successfully');
      setCancelModalOpen(false);
      form.resetFields();
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeOrders.detail(currentTenantId, orderId ?? null),
      });
    },
    onError: (cancelError: any) => {
      message.error(cancelError?.response?.data?.message || 'Failed to cancel order');
    },
  });

  const canCancel =
    role === APP_ROLES.tenantUser &&
    order?.status === ORDER_STATUSES.pendingApproval;

  const handleConfirmCancel = () => {
    form
      .validateFields()
      .then((values) => {
        cancelMutation.mutate(values.reason.trim());
      })
      .catch(() => {
        // Validation handled by Form.Item rules.
      });
  };

  if (!currentTenantId || !orderId) {
    return (
      <StorePageContainer>
        <Alert
          type="warning"
          showIcon
          message="Missing tenant or order context."
        />
      </StorePageContainer>
    );
  }

  if (isLoading) {
    return (
      <StorePageContainer>
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      </StorePageContainer>
    );
  }

  if (isError || !order) {
    return (
      <StorePageContainer>
        <Alert
          type="error"
          showIcon
          message="Failed to load order details"
          description={error instanceof Error ? error.message : 'Please try again.'}
        />
      </StorePageContainer>
    );
  }

  return (
    <StorePageContainer>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-slate-900">
              Order Details
            </Typography.Title>
            <Typography.Text type="secondary">
              Review your order status and history.
            </Typography.Text>
          </div>
          <Tag color={statusColorMap[order.status] || 'blue'}>{order.status}</Tag>
        </div>

        <Card>
          <Descriptions column={1} size="middle">
            <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
            <Descriptions.Item label="Delivery Address">{order.deliveryAddress}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">${order.totalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(order.createdAtUtc).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {order.updatedAtUtc ? new Date(order.updatedAtUtc).toLocaleString() : 'Not updated'}
            </Descriptions.Item>
          </Descriptions>

          {canCancel && (
            <div className="mt-4">
              <Button danger onClick={() => setCancelModalOpen(true)}>
                Cancel Order
              </Button>
            </div>
          )}
        </Card>

        <Card title="Status History">
          {order.statusHistory.length === 0 ? (
            <Typography.Text type="secondary">No status history available.</Typography.Text>
          ) : (
            <Timeline
              items={order.statusHistory.map((historyItem) => ({
                color: 'blue',
                children: (
                  <div>
                    <div className="font-medium text-slate-800">
                      {historyItem.actionName} ({historyItem.fromStatus || 'N/A'} -&gt; {historyItem.toStatus})
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(historyItem.changedAtUtc).toLocaleString()}
                    </div>
                    {historyItem.comment && (
                      <div className="mt-1 text-sm text-slate-600">{historyItem.comment}</div>
                    )}
                  </div>
                ),
              }))}
            />
          )}
        </Card>
      </div>

      <Modal
        open={cancelModalOpen}
        title="Cancel Order"
        okText="Confirm Cancel"
        okButtonProps={{ danger: true, loading: cancelMutation.isPending }}
        onOk={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              { required: true, message: 'Reason is required' },
              { min: 3, message: 'Reason must be at least 3 characters' },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Please explain why you want to cancel this order" />
          </Form.Item>
        </Form>
      </Modal>
    </StorePageContainer>
  );
};

export default StoreOrderDetailsPage;

