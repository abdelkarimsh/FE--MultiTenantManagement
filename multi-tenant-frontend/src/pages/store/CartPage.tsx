import React from 'react';
import { Button, Card, Empty, InputNumber, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../router/routes';
import { resolveProductImageUrl } from '../../utils/media';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <StorePageContainer>
        <Card>
          <Empty
            description="Your cart is empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate(ROUTES.store.products)}>
              Browse Products
            </Button>
          </Empty>
        </Card>
      </StorePageContainer>
    );
  }

  return (
    <StorePageContainer>
      <div className="space-y-4">
        <div>
          <Typography.Title level={2} className="!mb-2 !text-slate-900">
            Cart
          </Typography.Title>
          <Typography.Text type="secondary">
            Review selected products before checkout.
          </Typography.Text>
        </div>

        <Card>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    src={resolveProductImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-500">${item.price.toFixed(2)} each</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={() => decreaseQuantity(item.productId)}>-</Button>
                  <InputNumber
                    min={1}
                    max={item.stockQuantity > 0 ? item.stockQuantity : undefined}
                    value={item.quantity}
                    onChange={(value) => {
                      if (typeof value !== 'number') return;
                      setQuantity(item.productId, value);
                    }}
                  />
                  <Button onClick={() => increaseQuantity(item.productId)}>+</Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item.productId)}
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Typography.Text className="text-base">
                Subtotal (display only): <strong>${subtotal.toFixed(2)}</strong>
              </Typography.Text>
              <Space>
                <Button onClick={clearCart}>Clear Cart</Button>
                <Button type="primary" onClick={() => navigate(ROUTES.store.checkout)}>
                  Proceed to Checkout
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </StorePageContainer>
  );
};

export default CartPage;
