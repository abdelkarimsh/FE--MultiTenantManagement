import React, { useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { APP_ROLES, normalizeRole } from '../../types/auth';
import type { CreateUserRequest, UpdateUserRequest, UserDto } from '../../types/users';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../../hooks/users/useUserMutations';
import { useTenantUsersQuery } from '../../hooks/users/useUsersQueries';

const { Option } = Select;

const UsersPage: React.FC = () => {
  const { currentTenantId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [form] = Form.useForm();

  const { data: users, isLoading } = useTenantUsersQuery(currentTenantId);
  const createMutation = useCreateUserMutation('tenantAdmin');
  const updateMutation = useUpdateUserMutation('tenantAdmin');
  const deleteMutation = useDeleteUserMutation('tenantAdmin');

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleAddClick = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditClick = (user: UserDto) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: normalizeRole(user.roles?.[0]) ?? APP_ROLES.tenantUser,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (!currentTenantId) {
          message.error('No current tenant selected');
          return;
        }

        if (editingUser) {
          const payload: UpdateUserRequest = {
            phoneNumber: values.phoneNumber,
            role: values.role,
            tenantId: editingUser.tenantId ?? currentTenantId,
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
          password: values.password,
          phoneNumber: values.phoneNumber,
          role: values.role,
          tenantId: currentTenantId,
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
        description: 'Manage users for the current tenant.',
      }}
    >
      <Card
        title="Users"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            disabled={isSaving || !currentTenantId}
          >
            New User
          </Button>
        }
      >
        {!currentTenantId ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <span>Please select a tenant first.</span>
          </div>
        ) : isLoading ? (
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
          form.resetFields();
        }}
        onOk={handleSubmit}
        okButtonProps={{
          loading: createMutation.isPending || updateMutation.isPending,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: APP_ROLES.tenantUser,
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
              <Option value={APP_ROLES.tenantAdmin}>{APP_ROLES.tenantAdmin}</Option>
              <Option value={APP_ROLES.tenantUser}>{APP_ROLES.tenantUser}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UsersPage;

