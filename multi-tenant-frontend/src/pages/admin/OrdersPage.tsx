import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../router/routes';
import { ORDER_STATUSES, type GetOrdersQuery, type OrderListItem } from '../../types/order';

const { Title } = Typography;

const statusColorMap: Record<string, string> = {
  [ORDER_STATUSES.pendingApproval]: 'gold',
  [ORDER_STATUSES.approved]: 'green',
  [ORDER_STATUSES.rejected]: 'red',
  [ORDER_STATUSES.cancelled]: 'default',
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTenantId } = useAuth();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [customerId, setCustomerId] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>('createdAtUtc');
  const [isAscending, setIsAscending] = useState(false);

  const queryParams: GetOrdersQuery = useMemo(
    () => ({
      pageNumber,
      pageSize,
      sortBy,
      isAscending,
      search: search.trim() || undefined,
      status: status || undefined,
      customerId: customerId.trim() || undefined,
    }),
    [pageNumber, pageSize, sortBy, isAscending, search, status, customerId],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.tenantAdminOrders.list(currentTenantId, queryParams as Record<string, unknown>),
    queryFn: () => ordersApi.getOrders(currentTenantId as string, queryParams),
    enabled: !!currentTenantId,
    placeholderData: (prev) => prev,
  });

  const orders = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const handleTableChange: NonNullable<TableProps<OrderListItem>['onChange']> = (
    pagination: TablePaginationConfig,
    _filters,
    sorter: SorterResult<OrderListItem> | SorterResult<OrderListItem>[],
  ) => {
    if (pagination.current) setPageNumber(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);

    if (!Array.isArray(sorter) && sorter.field) {
      setSortBy(sorter.field as string);
      setIsAscending(sorter.order === 'ascend');
    }
  };

  const columns: ColumnsType<OrderListItem> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (value: string) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      title: 'Delivery Address',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (orderStatus: string) => (
        <Tag color={statusColorMap[orderStatus] || 'blue'}>{orderStatus}</Tag>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: true,
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAtUtc',
      key: 'createdAtUtc',
      sorter: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAtUtc',
      key: 'updatedAtUtc',
      render: (value: string | null) => (value ? new Date(value).toLocaleString() : 'Not updated'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(ROUTES.tenantAdmin.orderDetails(record.id))}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Orders
      </Title>

      <Card
        title="Orders"
        extra={
          <Space>
            <Input.Search
              allowClear
              placeholder="Search orders..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPageNumber(1);
              }}
              style={{ width: 220 }}
            />
            <Select
              allowClear
              placeholder="Status"
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPageNumber(1);
              }}
              style={{ width: 170 }}
              options={[
                { label: ORDER_STATUSES.pendingApproval, value: ORDER_STATUSES.pendingApproval },
                { label: ORDER_STATUSES.approved, value: ORDER_STATUSES.approved },
                { label: ORDER_STATUSES.rejected, value: ORDER_STATUSES.rejected },
                { label: ORDER_STATUSES.cancelled, value: ORDER_STATUSES.cancelled },
              ]}
            />
            <Input
              placeholder="Customer ID"
              value={customerId}
              onChange={(event) => {
                setCustomerId(event.target.value);
                setPageNumber(1);
              }}
              style={{ width: 220 }}
            />
          </Space>
        }
      >
        {!currentTenantId ? (
          <Alert type="warning" showIcon message="No tenant context found." />
        ) : isError ? (
          <Alert
            type="error"
            showIcon
            message="Failed to load orders"
            description={error instanceof Error ? error.message : 'Please try again.'}
          />
        ) : (
          <Table<OrderListItem>
            rowKey="id"
            dataSource={orders}
            columns={columns}
            onChange={handleTableChange}
            loading={isLoading}
            locale={{
              emptyText: isLoading ? (
                <div style={{ padding: 24 }}>
                  <Spin />
                </div>
              ) : (
                <Empty description="No orders found" />
              ),
            }}
            pagination={{
              current: pageNumber,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size);
              },
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;
