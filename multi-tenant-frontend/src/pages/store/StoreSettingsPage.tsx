import React, { useEffect } from 'react';
import { Alert, Button, Card, Form, Input, Spin, Typography, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { tenantApi } from '../../api/tenantApi';
import StorePageContainer from '../../components/store/StorePageContainer';
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { tenantStatusToCode, type TenantSettingsUpdateRequest } from '../../types/tenant';

interface StoreSettingsFormValues {
  name: string;
  subDomain: string;
  status: string;
  currency: string;
  theme: string;
  supportPhone: string;
}

const StoreSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<StoreSettingsFormValues>();
  const { currentTenantId } = useAuth();

  const {
    data: tenant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.tenants.byId(currentTenantId),
    queryFn: () => tenantApi.getById(currentTenantId as string),
    enabled: !!currentTenantId,
  });

  useEffect(() => {
    if (!tenant) return;

    form.setFieldsValue({
      name: tenant.name ?? '',
      subDomain: tenant.subDomain ?? '',
      status: tenant.status ?? '',
      currency: tenant.storeSetting?.currency ?? '',
      theme: tenant.storeSetting?.theme ?? '',
      supportPhone: tenant.storeSetting?.supportPhone ?? '',
    });
  }, [tenant, form]);

  const updateMutation = useMutation({
    mutationFn: (payload: TenantSettingsUpdateRequest) =>
      tenantApi.update(currentTenantId as string, payload),
    onSuccess: async () => {
      message.success('Store settings updated successfully');
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenants.byId(currentTenantId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeTenant.current,
      });
    },
    onError: (updateError: any) => {
      message.error(updateError?.response?.data?.message || 'Failed to update store settings');
    },
  });

  const handleSubmit = (values: StoreSettingsFormValues) => {
    if (!tenant || !currentTenantId) {
      message.error('Tenant information is unavailable');
      return;
    }

    const payload: TenantSettingsUpdateRequest = {
      id: tenant.id,
      name: values.name.trim(),
      status: tenantStatusToCode(tenant.status),
      logoURL: tenant.logoURL ?? '',
      attachmentId: tenant.attachmentId ?? null,
      attachmentUrl: tenant.attachmentUrl ?? null,
      subDomain: tenant.subDomain,
      createdAtUtc: tenant.createdAtUtc,
      storeSetting: {
        tenantId: tenant.storeSetting?.tenantId ?? tenant.id,
        currency: values.currency.trim(),
        theme: values.theme.trim(),
        supportPhone: values.supportPhone.trim(),
      },
    };

    updateMutation.mutate(payload);
  };

  if (!currentTenantId) {
    return (
      <StorePageContainer>
        <Alert
          type="warning"
          showIcon
          message="No tenant context was found for this account."
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

  if (isError || !tenant) {
    return (
      <StorePageContainer>
        <Alert
          type="error"
          showIcon
          message="Failed to load store settings"
          description={error instanceof Error ? error.message : 'Please try again.'}
        />
      </StorePageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: 'Account Settings',
        description: 'Manage your tenant store information and preferences.',
      }}
    >
      <div className="max-w-3xl">
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: '',
              subDomain: '',
              status: '',
              currency: '',
              theme: '',
              supportPhone: '',
            }}
          >
            <Typography.Title level={4}>Store Information</Typography.Title>
            <Form.Item
              label="Store Name"
              name="name"
              rules={[{ required: true, message: 'Store name is required' }]}
            >
              <Input placeholder="Store name" />
            </Form.Item>

            <Form.Item label="Subdomain" name="subDomain">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Input disabled />
            </Form.Item>

            <Typography.Title level={4}>Store Preferences</Typography.Title>
            <Form.Item
              label="Currency"
              name="currency"
              rules={[{ required: true, message: 'Currency is required' }]}
            >
              <Input placeholder="e.g. USD" />
            </Form.Item>

            <Form.Item
              label="Theme"
              name="theme"
              rules={[{ required: true, message: 'Theme is required' }]}
            >
              <Input placeholder="e.g. blue" />
            </Form.Item>

            <Form.Item
              label="Support Phone"
              name="supportPhone"
              rules={[{ required: true, message: 'Support phone is required' }]}
            >
              <Input placeholder="+1-555-123-4567" />
            </Form.Item>

            <Form.Item className="!mb-0">
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default StoreSettingsPage;
