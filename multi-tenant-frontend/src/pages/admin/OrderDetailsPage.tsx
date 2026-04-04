import React from 'react';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
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
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { useAuth } from '../../context/AuthContext';
import { ORDER_STATUSES } from '../../types/order';

interface RejectFormValues {
  reason: string;
}

const statusColorMap: Record<string, string> = {
  [ORDER_STATUSES.pendingApproval]: 'gold',
  [ORDER_STATUSES.approved]: 'green',
  [ORDER_STATUSES.rejected]: 'red',
  [ORDER_STATUSES.cancelled]: 'default',
};

const OrderDetailsPage: React.FC = () => {
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectForm] = Form.useForm<RejectFormValues>();
  const queryClient = useQueryClient();
  const { currentTenantId } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();

  const queryKey = queryKeys.tenantAdminOrders.detail(currentTenantId, orderId ?? null);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => ordersApi.getOrderById(currentTenantId as string, orderId as string),
    enabled: !!currentTenantId && !!orderId,
  });

  const approveMutation = useMutation({
    mutationFn: () => ordersApi.approveOrder(currentTenantId as string, orderId as string),
    onSuccess: async () => {
      message.success('Order approved successfully');
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantAdminOrders.all });
    },
    onError: (approveError: any) => {
      message.error(approveError?.response?.data?.message || 'Failed to approve order');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) =>
      ordersApi.rejectOrder(currentTenantId as string, orderId as string, { reason }),
    onSuccess: async () => {
      message.success('Order rejected successfully');
      setRejectModalOpen(false);
      rejectForm.resetFields();
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantAdminOrders.all });
    },
    onError: (rejectError: any) => {
      message.error(rejectError?.response?.data?.message || 'Failed to reject order');
    },
  });

  const canManageOrder = order?.status === ORDER_STATUSES.pendingApproval;

  const handleRejectSubmit = () => {
    rejectForm
      .validateFields()
      .then((values) => rejectMutation.mutate(values.reason.trim()))
      .catch(() => {
        // Validation is displayed by Form.
      });
  };

  if (!currentTenantId || !orderId) {
    return (
      <PageContainer header={{ title: 'Order Details' }}>
        <Alert type="warning" showIcon message="Missing tenant or order context." />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer header={{ title: 'Order Details' }}>
        <div className="flex items-center justify-center py-16">
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !order) {
    return (
      <PageContainer header={{ title: 'Order Details' }}>
        <Alert
          type="error"
          showIcon
          message="Failed to load order details"
          description={error instanceof Error ? error.message : 'Please try again.'}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: 'Order Details',
        description: 'Review order information, status history, and approval actions.',
      }}
    >
      <div className="space-y-4">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Typography.Title level={4} className="!mb-0">
              Order Metadata
            </Typography.Title>
            <Tag color={statusColorMap[order.status] || 'blue'}>{order.status}</Tag>
          </div>

          <Descriptions column={1}>
            <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
            <Descriptions.Item label="Customer ID">{order.customerId}</Descriptions.Item>
            <Descriptions.Item label="Delivery Address">{order.deliveryAddress}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">${order.totalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(order.createdAtUtc).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {order.updatedAtUtc ? new Date(order.updatedAtUtc).toLocaleString() : 'Not updated'}
            </Descriptions.Item>
          </Descriptions>

          {canManageOrder && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Popconfirm
                title="Approve this order?"
                description="This action will move the order to Approved."
                onConfirm={() => approveMutation.mutate()}
                okButtonProps={{ loading: approveMutation.isPending }}
              >
                <Button type="primary" loading={approveMutation.isPending}>
                  Approve
                </Button>
              </Popconfirm>

              <Button
                danger
                onClick={() => setRejectModalOpen(true)}
                loading={rejectMutation.isPending}
              >
                Reject
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
        open={rejectModalOpen}
        title="Reject Order"
        okText="Confirm Rejection"
        okButtonProps={{ danger: true, loading: rejectMutation.isPending }}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalOpen(false);
          rejectForm.resetFields();
        }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              { required: true, message: 'Reason is required' },
              { min: 3, message: 'Reason must be at least 3 characters' },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Provide rejection reason" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default OrderDetailsPage;
