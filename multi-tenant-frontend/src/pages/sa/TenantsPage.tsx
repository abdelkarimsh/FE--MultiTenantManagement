import React, { useState } from 'react';
import {
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Space,
  message,
  Switch,
  Tooltip,
  Divider,
} from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../api/queryKeys';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import CardWidget from '../../components/common/CardWidget';
import { tenantApi } from '../../api/tenantApi';
import type {
  CreateTenantRequest,
  PagedResult,
  TenantDto,
  TenantQueryParams,
  UpdateTenantRequest,
} from '../../types/tenant';

interface TenantFormValues {
  name: string;
  subDomain: string;
  logoURL?: string;
  isActive: boolean;
  storeSetting: {
    currency: string;
    theme: string;
    supportPhone: string;
  };
}

const TenantsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>('createdAtUtc');
  const [isAscending, setIsAscending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantDto | null>(null);

  const tenantQueryParams: TenantQueryParams = {
    pageNumber,
    pageSize,
    search: search || undefined,
    sortBy,
    isAscending,
  };

  const { data, isLoading } = useQuery<PagedResult<TenantDto>>({
    queryKey: queryKeys.tenants.list(tenantQueryParams),
    queryFn: async () => {
      const res = await tenantApi.getPaged(tenantQueryParams);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // ---------- Create / Update ----------
  const upsertMutation = useMutation({
    mutationFn: async (payload: CreateTenantRequest | UpdateTenantRequest) => {
      // نقرر هنا فقط بناءً على وجود Id
      if ('id' in payload) {
        return tenantApi.update(payload.id, payload);
      }
      return tenantApi.create(payload);
    },
    onSuccess: () => {
      message.success('Tenant saved successfully');
      setIsModalOpen(false);
      setEditingTenant(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
    },
    onError: () => {
      message.error('Failed to save tenant');
    },
  });

  // ---------- Delete ----------
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantApi.delete(id),
    onSuccess: () => {
      message.success('Tenant deleted');
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
    },
    onError: () => {
      message.error('Failed to delete tenant');
    },
  });

  // ---------- Modal (Create) ----------
  const openCreateModal = () => {
    setEditingTenant(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      storeSetting: {
        currency: 'USD',
        theme: 'default',
        supportPhone: '',
      },
    });
    setIsModalOpen(true);
  };

  // ---------- Modal (Edit) ----------
  const openEditModal = (tenant: TenantDto) => {
    setEditingTenant(tenant);

    form.setFieldsValue({
      name: tenant.name,
      subDomain: tenant.subDomain,
      logoURL: tenant.logoURL,
      isActive: tenant.status === 'Active',
      storeSetting: {
        currency: tenant.storeSetting?.currency ?? 'USD',
        theme: tenant.storeSetting?.theme ?? 'default',
        supportPhone: tenant.storeSetting?.supportPhone ?? '',
      },
    });

    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const mapStatus = (isActive: boolean) => (isActive ? 0 : 1);

  // هنا نبني الـ payload النهائي اللي يطابق CreateTenantRequestDto + StoreSettingDto
  const handleFormFinish = (values: TenantFormValues) => {
    const basePayload: CreateTenantRequest = {
      name: values.name,
      subDomain: values.subDomain,
      status: mapStatus(values.isActive),
      logoURL: values.logoURL,
      storeSetting: {
        currency: values.storeSetting?.currency,
        theme: values.storeSetting?.theme,
        supportPhone: values.storeSetting?.supportPhone,
      },
    };

    if (editingTenant) {
      const updatePayload: UpdateTenantRequest = {
        ...basePayload,
        id: editingTenant.id,
      };

      upsertMutation.mutate(updatePayload);
    } else {
      upsertMutation.mutate(basePayload);
    }
  };

  const handleDelete = (tenant: TenantDto) => {
    Modal.confirm({
      title: `Delete tenant "${tenant.name}"?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(tenant.id),
    });
  };

  const handleTableChange: NonNullable<TableProps<TenantDto>['onChange']> = (
    pagination,
    _filters,
    sorter
  ) => {
    if (pagination.current) setPageNumber(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);

    if (!Array.isArray(sorter) && sorter.field) {
      const sortField = sorter.field as string;
      setSortBy(sortField);
      setIsAscending(sorter.order === 'ascend');
    }
  };

  // ---------- Table Columns ----------
  const columns: ColumnsType<TenantDto> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Disabled', value: 'Disabled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) =>
        status === 'Active' ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Disabled</Tag>
        ),
    },
    {
      title: 'Subdomain',
      dataIndex: 'subDomain',
      key: 'subDomain',
    },
    {
      title: 'Currency',
      dataIndex: ['storeSetting', 'currency'],
      key: 'currency',
      render: (_, record) =>
        record.storeSetting?.currency ? record.storeSetting.currency : '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAtUtc',
      key: 'createdAtUtc',
      sorter: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? pageSize,
    total: data?.totalCount ?? 0,
    showSizeChanger: true,
  };

  return (
    <PageContainer
      header={{
        title: 'Tenants',
        breadcrumbs: [{ title: 'Home' }, { title: 'Tenants' }],
        extra: (
          <Space>
            <Input.Search
              placeholder="Search by name or subdomain"
              allowClear
              onSearch={(value) => {
                setPageNumber(1);
                setSearch(value);
              }}
              style={{ width: 260 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              New Tenant
            </Button>
          </Space>
        ),
      }}
    >
      <CardWidget>
        <Table<TenantDto>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data?.items ?? []}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </CardWidget>

      {/* Modal Create / Edit */}
      <Modal
        title={editingTenant ? 'Edit Tenant' : 'New Tenant'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={upsertMutation.isPending}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormFinish}
          initialValues={{
            isActive: true,
            storeSetting: {
              currency: 'USD',
              theme: 'default',
              supportPhone: '',
            },
          }}
        >
          {/* Name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter tenant name' },
              { max: 200, message: 'Name must be at most 200 characters' },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Subdomain */}
          <Form.Item
            label="Subdomain"
            name="subDomain"
            rules={[{ required: true, message: 'Please enter subdomain' }]}
          >
            <Input addonBefore="https://" addonAfter=".yourdomain.com" />
          </Form.Item>

          {/* Logo URL */}
          <Form.Item label="Logo URL" name="logoURL">
            <Input placeholder="https://..." />
          </Form.Item>

          {/* Active */}
          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* Store Settings */}
          <Divider>Store Settings</Divider>

          <Form.Item
            label="Currency"
            name={['storeSetting', 'currency']}
            rules={[
              { required: true, message: 'Please enter currency' },
              { max: 10, message: 'Currency must be at most 10 characters' },
            ]}
          >
            <Input placeholder="e.g. USD" />
          </Form.Item>

          <Form.Item
            label="Theme"
            name={['storeSetting', 'theme']}
            rules={[
              { required: true, message: 'Please enter theme' },
              { max: 50, message: 'Theme must be at most 50 characters' },
            ]}
          >
            <Input placeholder="e.g. dark-blue" />
          </Form.Item>

          <Form.Item
            label="Support Phone"
            name={['storeSetting', 'supportPhone']}
            rules={[
              { required: true, message: 'Please enter support phone' },
              { max: 30, message: 'Phone must be at most 30 characters' },
            ]}
          >
            <Input placeholder="+1-202-555-0139" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TenantsPage;
