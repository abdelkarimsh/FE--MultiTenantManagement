import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { tenantApi } from '../../api/tenantApi';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { APP_ROLES, normalizeRole } from '../../types/auth';
import type { TenantDropdownDto } from '../../types/tenant';
import type { CreateUserRequest, UpdateUserRequest, UserDto } from '../../types/users';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../../hooks/users/useUserMutations';
import { useSuperAdminUsersQuery } from '../../hooks/users/useUsersQueries';

const { Option } = Select;

interface UserFormValues {
  email: string;
  password?: string;
  phoneNumber?: string | null;
  tenantId?: string | null;
  role: string;
}

const SaUsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [tenantOptions, setTenantOptions] = useState<TenantDropdownDto[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [isTenantLoading, setIsTenantLoading] = useState(false);
  const [form] = Form.useForm<UserFormValues>();
  const selectedRole = Form.useWatch('role', form);

  const { data: users, isLoading } = useSuperAdminUsersQuery();
  const createMutation = useCreateUserMutation('superAdmin');
  const updateMutation = useUpdateUserMutation('superAdmin');
  const deleteMutation = useDeleteUserMutation('superAdmin');

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const isSystemAdminRole = selectedRole === APP_ROLES.systemAdmin;
  const tenantSelectOptions = useMemo(
    () => tenantOptions.map((tenant) => ({ value: tenant.id, label: tenant.name })),
    [tenantOptions],
  );

  useEffect(() => {
    if (!isModalOpen) return;

    const timeoutId = window.setTimeout(() => {
      setIsTenantLoading(true);
      tenantApi
        .getTenantDropdown(tenantSearch)
        .then((tenants) => {
          setTenantOptions((prev) => {
            const selectedTenantId = form.getFieldValue('tenantId');
            const selectedTenant = prev.find((tenant) => tenant.id === selectedTenantId);
            if (!selectedTenant || tenants.some((tenant) => tenant.id === selectedTenant.id)) {
              return tenants;
            }

            return [selectedTenant, ...tenants];
          });
        })
        .catch(() => {
          message.error('Failed to load tenants');
        })
        .finally(() => {
          setIsTenantLoading(false);
        });
    }, tenantSearch ? 300 : 0);

    return () => window.clearTimeout(timeoutId);
  }, [form, isModalOpen, tenantSearch]);

  useEffect(() => {
    if (selectedRole === APP_ROLES.systemAdmin) {
      form.setFieldValue('tenantId', null);
    }
  }, [form, selectedRole]);

  const handleAddClick = () => {
    setEditingUser(null);
    setTenantSearch('');
    setTenantOptions([]);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditClick = (user: UserDto) => {
    const userTenantName = user.tenant?.trim();

    setEditingUser(user);
    setTenantSearch('');
    setTenantOptions(
      user.tenantId ? [{ id: user.tenantId, name: userTenantName || 'Assigned tenant' }] : [],
    );
    form.setFieldsValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: normalizeRole(user.roles?.[0]) ?? APP_ROLES.tenantUser,
      tenantId:
        normalizeRole(user.roles?.[0]) === APP_ROLES.systemAdmin ? null : user.tenantId ?? null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingUser) {
          const payload: UpdateUserRequest = {
            phoneNumber: values.phoneNumber || undefined,
            tenantId: values.role === APP_ROLES.systemAdmin ? null : values.tenantId || null,
            role: values.role,
          };

          updateMutation.mutate(
            { id: editingUser.id, data: payload },
            {
              onSuccess: () => {
                message.success('User updated successfully');
                setIsModalOpen(false);
                setEditingUser(null);
                form.resetFields();
              },
              onError: (error: any) => {
                message.error(error?.response?.data?.message || 'Failed to update user');
              },
            },
          );
          return;
        }

        const payload: CreateUserRequest = {
          email: values.email,
          password: values.password as string,
          phoneNumber: values.phoneNumber || undefined,
          tenantId: values.role === APP_ROLES.systemAdmin ? null : values.tenantId || null,
          role: values.role,
        };

        createMutation.mutate(payload, {
          onSuccess: () => {
            message.success('User created successfully');
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Failed to create user');
          },
        });
      })
      .catch(() => {
        // Validation errors are displayed by Form.Item.
      });
  };

  const columns: ColumnsType<UserDto> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone?: string | null) => phone ?? '-',
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant?: string | null) => tenant?.trim() || '-',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) =>
        roles && roles.length > 0 ? <Tag>{roles[0]}</Tag> : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user?"
            description="Are you sure you want to delete this user?"
            onConfirm={() =>
              deleteMutation.mutate(record.id, {
                onSuccess: () => {
                  message.success('User deleted successfully');
                },
                onError: (error: any) => {
                  message.error(error?.response?.data?.message || 'Failed to delete user');
                },
              })
            }
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'User Management',
        description: 'Manage users across all tenants.',
      }}
    >
      <Card
        title="Users"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            disabled={isSaving}
          >
            New User
          </Button>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Table<UserDto>
            rowKey="id"
            dataSource={users ?? []}
            columns={columns}
            pagination={{ pageSize: 10 }}
            loading={isSaving}
          />
        )}
      </Card>

      <Modal
        open={isModalOpen}
        title={editingUser ? 'Edit User' : 'Create User'}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          setTenantSearch('');
          setTenantOptions([]);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okButtonProps={{ loading: createMutation.isPending || updateMutation.isPending }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: APP_ROLES.tenantAdmin,
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Email is not valid' },
            ]}
          >
            <Input placeholder="user@example.com" disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder="Initial password" />
            </Form.Item>
          )}

          <Form.Item label="Phone Number" name="phoneNumber">
            <Input placeholder="+9705..." />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select placeholder="Select role">
              <Option value={APP_ROLES.systemAdmin}>{APP_ROLES.systemAdmin}</Option>
              <Option value={APP_ROLES.tenantAdmin}>{APP_ROLES.tenantAdmin}</Option>
              <Option value={APP_ROLES.tenantUser}>{APP_ROLES.tenantUser}</Option>
            </Select>
          </Form.Item>

          {!isSystemAdminRole && (
            <Form.Item
              label="Tenant"
              name="tenantId"
              rules={[{ required: true, message: 'Tenant is required for this role' }]}
            >
              <Select
                allowClear
                showSearch
                filterOption={false}
                loading={isTenantLoading}
                notFoundContent={isTenantLoading ? <Spin size="small" /> : null}
                options={tenantSelectOptions}
                placeholder="Search and select a tenant"
                onSearch={setTenantSearch}
                onClear={() => setTenantSearch('')}
                onChange={(value) => form.setFieldValue('tenantId', value ?? null)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SaUsersPage;
