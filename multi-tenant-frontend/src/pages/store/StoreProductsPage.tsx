import React, { useMemo, useState } from 'react';
import { Button, Card, Empty, Input, Spin, Tag, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryKeys } from '../../api/queryKeys';
import { productsApi } from '../../api/productsApi';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { ROUTES } from '../../router/routes';
import type { ProductDto } from '../../types/product';
import type { PagedResult } from '../../types/tenant';
import { PRODUCT_IMAGE_PLACEHOLDER, resolveProductImageUrl } from '../../utils/media';

const StoreProductsPage: React.FC = () => {
  const { currentTenantId } = useAuth();
  const { tenant } = useStore();
  const { addItem, itemCount } = useCart();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy] = useState<string | undefined>(undefined);
  const [isAscending] = useState(true);

  const { data, isLoading } = useQuery<PagedResult<ProductDto>>({
    queryKey: queryKeys.storeProducts.list(
      currentTenantId,
      pageNumber,
      pageSize,
      search,
      sortBy,
      isAscending,
    ),
    queryFn: () =>
      productsApi.getProducts(
        currentTenantId as string,
        pageNumber,
        pageSize,
        sortBy,
        isAscending,
        search || undefined,
      ),
    enabled: !!currentTenantId,
    placeholderData: (previousData) => previousData,
  });

  const products = data?.items ?? [];
  const hasNextPage = typeof data?.hasNext === 'boolean' ? data.hasNext : products.length >= pageSize;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(1);
    setSearch(event.target.value);
  };

  const headerTitle = useMemo(() => (search ? `Results for "${search}"` : 'Products'), [search]);

  const handleAddToCart = (product: ProductDto) => {
    if (!currentTenantId) {
      message.error('Tenant context is missing');
      return;
    }

    addItem(currentTenantId, product, 1);
    message.success(`${product.name} added to cart`);
  };

  return (
    <StorePageContainer>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{headerTitle}</h1>
            <p className="text-sm text-slate-500">
              Browse products available in {tenant?.displayName ?? 'your store'}.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <div className="flex gap-2">
              <Input.Search
                placeholder="Search products..."
                allowClear
                value={search}
                onChange={handleSearchChange}
              />
              <Button icon={<ShoppingCartOutlined />} onClick={() => navigate(ROUTES.store.cart)}>
                Cart ({itemCount})
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const inStock = (product.stockQuantity ?? 0) > 0;
                const isActive = product.isActive;

                const statusLabel = !isActive ? 'Inactive' : inStock ? 'In stock' : 'Out of stock';
                const statusColor = !isActive ? 'default' : inStock ? 'success' : 'warning';

                return (
                  <Card
                    key={product.id}
                    hoverable
                    className="flex h-full flex-col overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-lg [&_.ant-card-body]:flex [&_.ant-card-body]:flex-1 [&_.ant-card-body]:flex-col [&_.ant-card-body]:p-4"
                    cover={
                      <div className="h-56 w-full overflow-hidden border-b border-slate-100 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveProductImageUrl(product.imageUrl)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            if (event.currentTarget.src === PRODUCT_IMAGE_PLACEHOLDER) return;
                            event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                          }}
                        />
                      </div>
                    }
                  >
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="space-y-1">
                        <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="line-clamp-2 min-h-10 text-sm text-slate-500">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-orange-600">
                          ${product.price?.toFixed(2) ?? '0.00'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <Tag color={statusColor as any}>{statusLabel}</Tag>
                        <span className="text-slate-400">In stock: {product.stockQuantity ?? 0}</span>
                      </div>

                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="mt-auto"
                        block
                        disabled={!inStock || !isActive}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {products.length === 0 && (
              <div className="py-20">
                <Empty description="No products found" />
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))} disabled={pageNumber === 1}>
                Previous
              </Button>
              <span className="text-sm text-slate-600">Page {pageNumber}</span>
              <Button onClick={() => setPageNumber((prev) => prev + 1)} disabled={!hasNextPage}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </StorePageContainer>
  );
};

export default StoreProductsPage;
