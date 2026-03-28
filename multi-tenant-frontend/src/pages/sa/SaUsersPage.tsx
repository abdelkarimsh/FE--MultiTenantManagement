// src/pages/sa/SaUsersPage.tsx

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Spin,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { usersApi } from '../../api/usersApi';
import { APP_ROLES, normalizeRole } from '../../types/auth';
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '../../types/users';

const { Title } = Typography;
const { Option } = Select;

const SaUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [form] = Form.useForm();

  // 🔹 قراءة جميع المستخدمين (Super Admin – كل التيننتس)
  const { data: users, isLoading } = useQuery({
    queryKey: queryKeys.superAdminUsers.all,
    queryFn: () => usersApi.getUsers(), // ممكن تمرر tenantId هنا لو بدك فلترة
  });

  // 🔹 Create
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserRequest) => usersApi.createUser(payload),
    onSuccess: () => {
      message.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdminUsers.all });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to create user');
    },
  });

  // 🔹 Update
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: UpdateUserRequest }) =>
      usersApi.updateUser(data.id, data.payload),
    onSuccess: () => {
      message.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdminUsers.all });
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to update user');
    },
  });

  // 🔹 Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdminUsers.all });
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to delete user');
    },
  });

  // فتح مودال إضافة
  const handleAddClick = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // فتح مودال تعديل
  const handleEditClick = (user: UserDto) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      tenantId: user.tenantId,
      role: normalizeRole(user.roles?.[0]) ?? APP_ROLES.tenantUser,
    });
    setIsModalOpen(true);
  };

  // Submit (Create / Update)
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingUser) {
          const payload: UpdateUserRequest = {
            phoneNumber: values.phoneNumber,
            tenantId: values.tenantId || null,
            role: values.role,
          };
          updateMutation.mutate({ id: editingUser.id, payload });
        } else {
          const payload: CreateUserRequest = {
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber,
            tenantId: values.tenantId || null,
            role: values.role,
          };
          createMutation.mutate(payload);
        }
      })
      .catch(() => {
        /* validation errors */
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
      render: (phone?: string | null) => phone ?? '—',
    },
    {
      title: 'Tenant Id',
      dataIndex: 'tenantId',
      key: 'tenantId',
      render: (tenantId?: string | null) => tenantId ?? '—',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) =>
        roles && roles.length > 0 ? <Tag>{roles[0]}</Tag> : '—',
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
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        User Management
      </Title>

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

      {/* Modal: Create / Edit */}
      <Modal
        open={isModalOpen}
        title={editingUser ? 'Edit User' : 'Create User'}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
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

          {/* Password فقط في الـ Create */}
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

          <Form.Item label="Tenant Id" name="tenantId">
            <Input placeholder="Optional Tenant UUID" />
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
        </Form>
      </Modal>
    </div>
  );
};

export default SaUsersPage;
