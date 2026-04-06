import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Empty, Input, Select, Skeleton, Tooltip } from 'antd';
import { EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, StopOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ROUTES } from '../../router/routes';
import type { GetOrdersQuery, OrderListItem } from '../../types/order';
import type { PagedResult } from '../../types/tenant';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = 'createdAtUtc';
const DEFAULT_IS_ASCENDING = false;

const statusClassByValue: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-300',
  pendingapproval: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-300',
  approved: 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-300',
  delivered: 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-300',
  processing: 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-300',
  rejected: 'bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-300',
  cancelled: 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-300',
};

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Pending Approval', value: 'PendingApproval' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const toOrderCode = (orderId: string) => `ORD-${orderId.slice(0, 4).toUpperCase()}`;

const normalizeStatusLabel = (status: string) => {
  if (!status) return 'Unknown';
  const normalized = status.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getStatusIcon = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved' || normalized === 'delivered') return <CheckCircleOutlined />;
  if (normalized === 'pending' || normalized === 'pendingapproval' || normalized === 'processing') return <ClockCircleOutlined />;
  if (normalized === 'rejected') return <CloseCircleOutlined />;
  if (normalized === 'cancelled') return <StopOutlined />;
  return null;
};

const formatDate = (dateValue: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));

const StoreOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTenantId } = useAuth();
  const { tenant } = useStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState(DEFAULT_SORT_BY);
  const [isAscending] = useState(DEFAULT_IS_ASCENDING);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const queryParams: GetOrdersQuery = useMemo(
    () => ({
      pageNumber,
      pageSize,
      sortBy,
      isAscending,
      status: status || undefined,
    }),
    [pageNumber, pageSize, sortBy, isAscending, status],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<PagedResult<OrderListItem>>({
    queryKey: queryKeys.storeOrders.list(
      currentTenantId,
      pageNumber,
      pageSize,
      sortBy,
      isAscending,
      status,
    ),
    queryFn: () => ordersApi.getCustomerOrders(currentTenantId as string, queryParams),
    enabled: !!currentTenantId,
    placeholderData: (prev) => prev,
  });

  const allOrders = data?.items ?? [];
  const normalizedSearch = search.trim().toUpperCase();
  const displayedOrders = normalizedSearch
    ? allOrders.filter((order) => toOrderCode(order.id).includes(normalizedSearch))
    : allOrders;

  const hasNext = data?.hasNext ?? false;
  const hasPrevious = data?.hasPrevious ?? pageNumber > 1;
  const totalPages = data?.totalPages ?? 1;
  const currentCount = displayedOrders.length;

  const amountFormatter = useMemo(() => {
    if (tenant?.currency) {
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: tenant.currency,
        });
      } catch {
        // Fallback to decimal formatting when tenant currency is missing/invalid.
      }
    }

    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [tenant?.currency]);

  const showNoOrders = !isLoading && !isError && allOrders.length === 0 && !normalizedSearch;
  const showNoSearchResults = !isLoading && !isError && allOrders.length > 0 && displayedOrders.length === 0;

  return (
    <StorePageContainer>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">My Orders</h1>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-md">
            <Input
              allowClear
              value={search}
              placeholder="Search by order code (e.g. ORD-3FA8)"
              onChange={(event) => {
                setSearch(event.target.value);
                setPageNumber(1);
              }}
            />
          </div>
          <div className="w-full sm:w-56">
            <Select
              allowClear
              className="w-full"
              value={status}
              placeholder="Filter by status"
              options={STATUS_OPTIONS}
              onChange={(value) => {
                setStatus(value);
                setPageNumber(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.1fr_0.9fr_0.9fr_1fr_1.6fr_0.7fr] gap-4 border-b border-slate-200 bg-slate-50/90 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400 md:grid">
            <span className="text-center">Order Code</span>
            <span className="text-center">Date</span>
            <span className="text-center">Status</span>
            <span className="text-center">Total Amount</span>
            <span className="text-center">Delivery Address</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="rounded-xl border border-slate-100 p-4">
                    <Skeleton active paragraph={{ rows: 2 }} title />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="px-4 py-14 text-center">
                <h3 className="text-base font-semibold text-slate-900">Unable to load your orders</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Something went wrong while fetching orders. Please try again.
                </p>
                <Button className="mt-4" type="primary" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : showNoOrders ? (
              <div className="py-16">
                <Empty
                  description={
                    <div className="space-y-1">
                      <div className="text-base font-medium text-slate-700">No orders yet</div>
                      <div className="text-sm text-slate-500">
                        Your placed orders will appear here once you make a purchase.
                      </div>
                    </div>
                  }
                />
              </div>
            ) : showNoSearchResults ? (
              <div className="py-16">
                <Empty
                  description={
                    <div className="space-y-1">
                      <div className="text-base font-medium text-slate-700">No matching orders</div>
                      <div className="text-sm text-slate-500">No orders found for this order code.</div>
                    </div>
                  }
                />
              </div>
            ) : (
              displayedOrders.map((order) => {
                const orderCode = toOrderCode(order.id);
                const statusValue = String(order.status ?? '');
                const normalizedStatus = statusValue.toLowerCase();
                const badgeClass =
                  statusClassByValue[normalizedStatus] || 'bg-sky-50 text-sky-700 border border-sky-200';

                return (
                  <div
                    key={order.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(ROUTES.store.orderDetails(order.id))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigate(ROUTES.store.orderDetails(order.id));
                      }
                    }}
                    className="grid cursor-pointer grid-cols-1 gap-2 px-4 py-2.5 transition-colors hover:bg-slate-50 md:grid-cols-[1.1fr_0.9fr_0.9fr_1fr_1.6fr_0.7fr] md:items-center md:gap-4"
                  >
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Order Code</div>
                      <div className="font-mono text-sm font-semibold tracking-[0.03em] text-slate-900">{orderCode}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Date</div>
                      <div className="text-sm text-slate-700">{formatDate(order.createdAtUtc)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Status</div>
                      <div className="flex justify-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClass}`}>
                          <span className="mr-1 inline-flex items-center">{getStatusIcon(statusValue)}</span>
                          {normalizeStatusLabel(statusValue)}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Total Amount</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {amountFormatter.format(order.totalAmount)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-400 md:hidden">Delivery Address</div>
                      <Tooltip title={order.deliveryAddress || 'No delivery address'}>
                        <div className="truncate text-sm text-slate-600">{order.deliveryAddress || '-'}</div>
                      </Tooltip>
                    </div>

                    <div className="flex justify-center">
                      <Tooltip title="View order details">
                        <Button
                          type="text"
                          shape="circle"
                          aria-label="View details"
                          icon={<EyeOutlined />}
                          className="text-slate-500 hover:!bg-slate-100 hover:!text-slate-900"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(ROUTES.store.orderDetails(order.id));
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <Button disabled={!hasPrevious || isFetching} onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {pageNumber} of {Math.max(1, totalPages)}
          </span>
          <Button disabled={!hasNext || isFetching} onClick={() => setPageNumber((prev) => prev + 1)}>
            Next
          </Button>
          <span className="text-xs text-slate-400 sm:ml-2">Showing {currentCount} orders</span>
        </div>
      </div>
    </StorePageContainer>
  );
};

export default StoreOrdersPage;
