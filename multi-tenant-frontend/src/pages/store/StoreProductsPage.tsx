// src/pages/store/StoreProductsPage.tsx

import React, { useState, useMemo } from 'react';
import { Card, Input, Tag, Button, Pagination, Spin, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/productsApi';
import { useAuth } from '../../context/AuthContext';
import type { ProductDto } from '../../types/products';
import type { PagedResult } from '../../types/common';

const { Meta } = Card;

const StoreProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [search, setSearch] = useState<string>('');

  const currentTenantId = user?.tenantId ?? null;

  const { data, isLoading } = useQuery<PagedResult<ProductDto>>({
    queryKey: ['store-products', currentTenantId, pageNumber, pageSize, search],
    queryFn: () =>
      productsApi.getProducts(
        currentTenantId as string,
        pageNumber,
        pageSize,
        search || undefined
      ),
    enabled: !!currentTenantId,
    keepPreviousData: true,
  });

  const products = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(1);
    setSearch(e.target.value);
  };

  const headerTitle = useMemo(
    () => (search ? `Results for "${search}"` : 'Products'),
    [search]
  );

  return (
    <div className="space-y-4">
      {/* Header + Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {headerTitle}
          </h1>
          <p className="text-sm text-slate-500">
            Browse products available in your store.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Input.Search
            placeholder="Search products..."
            allowClear
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20">
          <Empty description="No products found" />
        </div>
      ) : (
        <>
          {/* Products grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const inStock = (p.stockQuantity ?? 0) > 0;
              const active = p.isActive;

              const statusLabel = !active
                ? 'Inactive'
                : inStock
                ? 'In stock'
                : 'Out of stock';

              const statusColor = !active
                ? 'default'
                : inStock
                ? 'success'
                : 'warning';

              return (
                <Card
                  key={p.id}
                  hoverable
                  className="rounded-xl shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
                  cover={
                    <div className="bg-white flex items-center justify-center h-52 border-b">
                      {/* صورة المنتج أو Placeholder */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          p.imageUrl ||
                          'https://via.placeholder.com/300x300.png?text=Product'
                        }
                        alt={p.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                  }
                >
                  <div className="flex flex-col gap-2 h-full">
                    <Meta
                      title={
                        <span className="line-clamp-2 font-semibold">
                          {p.name}
                        </span>
                      }
                      description={
                        <span className="text-sm text-slate-500 line-clamp-2">
                          {p.description}
                        </span>
                      }
                    />

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl font-bold text-orange-600">
                        ${p.price?.toFixed(2) ?? '0.00'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-xs">
                      <Tag color={statusColor as any}>{statusLabel}</Tag>
                      <span className="text-slate-400">
                        In stock: {p.stockQuantity ?? 0}
                      </span>
                    </div>

                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      className="mt-3"
                      block
                      disabled={!inStock || !active}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={totalCount}
                onChange={(page) => setPageNumber(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoreProductsPage;
