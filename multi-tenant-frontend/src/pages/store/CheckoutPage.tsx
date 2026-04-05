import React from 'react';
import { Alert, Button, Card, Empty, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../router/routes';
import { useCreateOrderMutation } from '../../hooks/orders/useCreateOrderMutation';
import type { CreateOrderRequest } from '../../types/order';

interface CheckoutFormValues {
  deliveryAddress: string;
}

const getCustomerIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    );
    const decodedPayload = JSON.parse(atob(paddedPayload)) as Record<string, unknown>;

    const candidate =
      decodedPayload.sub ??
      decodedPayload.nameid ??
      decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : null;
  } catch {
    return null;
  }
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutFormValues>();
  const { items, subtotal, clearCart } = useCart();
  const { currentTenantId, token } = useAuth();
  const customerId = getCustomerIdFromToken(token);

  const createBaseMutation = useCreateOrderMutation(currentTenantId);

  const handleSubmit = (values: CheckoutFormValues) => {
    if (!currentTenantId) {
      message.error('Tenant context is missing');
      return;
    }

    if (!customerId) {
      message.error('Unable to resolve current user id from the session token');
      return;
    }

    if (items.length === 0) {
      message.error('Cart is empty');
      return;
    }

    const payload: CreateOrderRequest = {
      customerId,
      deliveryAddress: values.deliveryAddress.trim(),
      totalAmount: subtotal,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    createBaseMutation.mutate(payload, {
      onSuccess: (order) => {
        clearCart();
        message.success('Order created successfully');
        navigate(ROUTES.store.orderDetails(order.id));
      },
      onError: (error: any) => {
        message.error(error?.response?.data?.message || 'Failed to create order');
      },
    });
  };

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
            Checkout
          </Typography.Title>
          <Typography.Text type="secondary">
            Confirm your delivery details and place the order.
          </Typography.Text>
        </div>

        {!customerId && (
          <Alert
            type="warning"
            showIcon
            message="Your session is missing a customer identifier. You cannot place an order right now."
          />
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2" title="Delivery Details">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Delivery Address"
                name="deliveryAddress"
                rules={[
                  { required: true, message: 'Delivery address is required' },
                  { min: 5, message: 'Delivery address is too short' },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Street, city, and any delivery notes" />
              </Form.Item>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createBaseMutation.isPending}
                  disabled={!customerId}
                >
                  Place Order
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Order Summary">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-slate-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                Total (display only): ${subtotal.toFixed(2)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </StorePageContainer>
  );
};

export default CheckoutPage;
