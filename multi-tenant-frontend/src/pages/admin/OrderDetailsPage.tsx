import React from 'react';
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Timeline,
  Typography,
  message,
} from 'antd';
import { ClockCircleOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { useAuth } from '../../context/AuthContext';
import { canTenantAdminManageOrder } from '../../types/order';
import { useTenantAdminOrderDetailsQuery } from '../../hooks/orders/useOrderDetailsQuery';
import { useApproveOrderMutation } from '../../hooks/orders/useApproveOrderMutation';
import { useRejectOrderMutation } from '../../hooks/orders/useRejectOrderMutation';
import OrderStatusTag from '../../components/common/OrderStatusTag';

interface RejectFormValues {
  reason: string;
}

const toOrderCode = (id: string) => `ORD-${id.slice(0, 4).toUpperCase()}`;

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const OrderDetailsPage: React.FC = () => {
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectForm] = Form.useForm<RejectFormValues>();
  const { currentTenantId } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useTenantAdminOrderDetailsQuery(currentTenantId, orderId ?? null);

  const approveBaseMutation = useApproveOrderMutation(currentTenantId, orderId ?? null);
  const approveMutation = useMutation({
    mutationFn: () => approveBaseMutation.mutateAsync(),
    onSuccess: () => {
      message.success('Order approved successfully');
    },
    onError: (approveError: any) => {
      message.error(approveError?.response?.data?.message || 'Failed to approve order');
    },
  });
  const rejectBaseMutation = useRejectOrderMutation(currentTenantId, orderId ?? null);
  const rejectMutation = useMutation({
    mutationFn: (reason: string) => rejectBaseMutation.mutateAsync(reason),
    onSuccess: () => {
      message.success('Order rejected successfully');
      setRejectModalOpen(false);
      rejectForm.resetFields();
    },
    onError: (rejectError: any) => {
      message.error(rejectError?.response?.data?.message || 'Failed to reject order');
    },
  });

  const canManageOrder = order ? canTenantAdminManageOrder(order.status) : false;
  const amountFormatter = React.useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

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
      <PageContainer>
        <div className="space-y-4">
          <Card className="rounded-3xl">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
          <Card className="rounded-3xl">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
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
    <PageContainer>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-slate-900">
              Order Details
            </Typography.Title>
            <Typography.Text type="secondary">
              Review the order, items, and status history
            </Typography.Text>
          </div>
          <OrderStatusTag status={order.status} />
        </div>

        <Card className="rounded-3xl">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <ShoppingCartOutlined />
            <span className="text-base font-semibold">Order Summary</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Order Code</div>
              <div className="mt-2 text-lg font-semibold tracking-wide text-slate-900">
                {toOrderCode(order.id)}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Customer ID</div>
              <div className="mt-2 text-sm font-medium text-slate-800 break-all">{order.customerId}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Delivery Address</div>
              <div className="mt-2 text-sm font-medium text-slate-800">{order.deliveryAddress || '-'}</div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Total Amount</div>
              <div className="mt-2 text-2xl font-bold text-emerald-800">
                {amountFormatter.format(order.totalAmount)}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Created At</div>
              <div className="mt-2 text-sm text-slate-800">{formatDateTime(order.createdAtUtc)}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated At</div>
              <div className="mt-2 text-sm text-slate-800">
                {order.updatedAtUtc ? formatDateTime(order.updatedAtUtc) : 'No updates yet'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2 lg:col-span-1">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</div>
              <div className="mt-2">
                <OrderStatusTag status={order.status} />
              </div>
            </div>
          </div>

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

        <Card className="rounded-3xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-800">
              <ShoppingOutlined />
              <span className="text-base font-semibold">Order Items</span>
            </div>
            <span className="text-sm text-slate-500">
              {(order.listItems ?? order.items ?? []).length} items in this order
            </span>
          </div>

          {(order.listItems ?? order.items ?? []).length === 0 ? (
            <Empty description="No items found in this order." />
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="hidden grid-cols-[2fr_0.7fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                  <span>Product Name</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Unit Price</span>
                  <span className="text-right">Line Total</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {(order.listItems ?? order.items ?? []).map((item) => {
                    const lineTotal = (item.quantity ?? 0) * (item.unitPrice ?? 0);

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[2fr_0.7fr_1fr_1fr] md:items-center md:gap-4"
                      >
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Product</div>
                          <div className="text-sm font-medium text-slate-900">
                            {item.productName || 'Unnamed product'}
                          </div>
                        </div>

                        <div className="md:text-center">
                          <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Quantity</div>
                          <div className="text-sm text-slate-700">{item.quantity}</div>
                        </div>

                        <div className="md:text-right">
                          <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Unit Price</div>
                          <div className="text-sm text-slate-700">{amountFormatter.format(item.unitPrice)}</div>
                        </div>

                        <div className="md:text-right">
                          <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Line Total</div>
                          <div className="text-sm font-semibold text-slate-900">{amountFormatter.format(lineTotal)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Order Total</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {amountFormatter.format(order.totalAmount)}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card className="rounded-3xl">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <ClockCircleOutlined />
            <span className="text-base font-semibold">Status History</span>
          </div>
          {order.statusHistory.length === 0 ? (
            <div className="py-6">
              <Empty
                description={
                  <div className="space-y-1">
                    <div className="text-base font-medium text-slate-700">No status updates yet</div>
                    <div className="text-sm text-slate-500">
                      Your order is waiting for the next update
                    </div>
                  </div>
                }
              />
            </div>
          ) : (
            <Timeline
              items={order.statusHistory.map((historyItem) => ({
                color: 'blue',
                children: (
                  <div className="pb-1">
                    <div className="font-medium text-slate-800">
                      {historyItem.actionName} ({historyItem.fromStatus || 'N/A'} -&gt; {historyItem.toStatus})
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDateTime(historyItem.changedAtUtc)}
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
