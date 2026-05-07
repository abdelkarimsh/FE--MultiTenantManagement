import React from 'react';
import { Button, Card, Empty, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMutationErrorMessage, PRODUCT_OUTDATED_MESSAGE } from '../../api/apiErrors';
import { productsApi } from '../../api/productsApi';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../router/routes';
import { useCreateOrderMutation } from '../../hooks/orders/useCreateOrderMutation';
import type { CreateOrderItemRequest, CreateOrderRequest } from '../../types/order';

interface CheckoutFormValues {
  deliveryAddress: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutFormValues>();
  const { items, subtotal, clearCart, updateItemProductVersion } = useCart();
  const { currentTenantId } = useAuth();

  const createBaseMutation = useCreateOrderMutation(currentTenantId);

  const resolveOrderItems = async (): Promise<CreateOrderItemRequest[] | null> => {
    if (!currentTenantId) {
      return null;
    }

    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        if (typeof item.productVersion === 'number') {
          return {
            productId: item.productId,
            quantity: item.quantity,
            productVersion: item.productVersion,
          };
        }

        const latestProduct = await productsApi.getProductById(currentTenantId, item.productId);
        if (typeof latestProduct.version !== 'number') return null;

        updateItemProductVersion(item.productId, latestProduct.version);
        return {
          productId: item.productId,
          quantity: item.quantity,
          productVersion: latestProduct.version,
        };
      }),
    );

    return resolvedItems.every((item): item is CreateOrderItemRequest => item !== null)
      ? resolvedItems
      : null;
  };

  const handleSubmit = async (values: CheckoutFormValues) => {
    try {
      if (!currentTenantId) {
        message.error('Tenant context is missing');
        return;
      }

      if (items.length === 0) {
        message.error('Cart is empty');
        return;
      }

      const orderItems = await resolveOrderItems();
      if (!orderItems) {
        message.error(PRODUCT_OUTDATED_MESSAGE);
        return;
      }

      const payload: CreateOrderRequest = {
        deliveryAddress: values.deliveryAddress.trim(),
        items: orderItems,
      };

      createBaseMutation.mutate(payload, {
        onSuccess: (order) => {
          clearCart();
          message.success('Order created successfully');
          navigate(ROUTES.store.orderDetails(order.id));
        },
        onError: (error: unknown) => {
          message.error(getMutationErrorMessage(error, 'Failed to create order'));
        },
      });
    } catch {
      message.error(PRODUCT_OUTDATED_MESSAGE);
    }
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
