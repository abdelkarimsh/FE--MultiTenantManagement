// src/pages/admin/AdminProductsPage.tsx

import React, { useState, useEffect } from 'react';
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
  InputNumber,
  Switch,
  Popconfirm,
  Spin,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  productsApi,
  type ProductDto,
  type CreateProductRequest,
  type UpdateProductRequest,
} from '../../api/productsApi';

// نفس الـ AuthContext اللي استخدمناه في الـ Users
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const AdminProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const currentTenantId = user?.tenantId ?? null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);

  // نتحكم في pagination بناءً على الـ backend
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', currentTenantId, pageNumber, pageSize],
    queryFn: () =>
      productsApi.getProducts(currentTenantId as string, pageNumber, pageSize),
    enabled: !!currentTenantId,
     placeholderData: (prev) => prev,
  });

  const products = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  // 🔹 Create
  const createMutation = useMutation({
    mutationFn: (payload: CreateProductRequest) =>
      productsApi.createProduct(currentTenantId as string, payload),
    onSuccess: () => {
      message.success('Product created successfully');
      queryClient.invalidateQueries({
        queryKey: ['admin-products', currentTenantId],
      });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to create product');
    },
  });

  // 🔹 Update
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: UpdateProductRequest }) =>
      productsApi.updateProduct(
        currentTenantId as string,
        data.id,
        data.payload
      ),
    onSuccess: () => {
      message.success('Product updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['admin-products', currentTenantId],
      });
      setIsModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to update product');
    },
  });

  // 🔹 Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      productsApi.deleteProduct(currentTenantId as string, id),
    onSuccess: () => {
      message.success('Product deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['admin-products', currentTenantId],
      });
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Failed to delete product');
    },
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // فتح مودال إضافة
  const handleAddClick = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      stockQuantity: 0,
      price: 0,
    });
    setIsModalOpen(true);
  };

  // فتح مودال تعديل
  const handleEditClick = (product: ProductDto) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  // Submit (Create / Update)
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const payload: CreateProductRequest | UpdateProductRequest = {
          name: values.name,
          description: values.description,
          price: values.price,
          imageUrl: values.imageUrl,
          stockQuantity: values.stockQuantity,
          isActive: values.isActive,
        };

        if (editingProduct) {
          updateMutation.mutate({ id: editingProduct.id, payload });
        } else {
          createMutation.mutate(payload as CreateProductRequest);
        }
      })
      .catch(() => {
        // validation errors
      });
  };

  const columns: ColumnsType<ProductDto> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) =>
        v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
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
            title="Delete product?"
            description="Are you sure you want to delete this product?"
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Products
      </Title>

      <Card
        title="Products"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            disabled={isSaving || !currentTenantId}
          >
            New Product
          </Button>
        }
      >
        {!currentTenantId ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            Please select a tenant first.
          </div>
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Table<ProductDto>
            rowKey="id"
            dataSource={products}
            columns={columns}
            loading={isSaving}
            pagination={{
              current: pageNumber,
              pageSize,
              total: totalCount,
              onChange: (page, pageSize) => {
                setPageNumber(page);
                setPageSize(pageSize);
              },
            }}
          />
        )}
      </Card>

      {/* Modal: Create / Edit */}
      <Modal
        open={isModalOpen}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okButtonProps={{
          loading: createMutation.isPending || updateMutation.isPending,
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="Product name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea rows={3} placeholder="Product description" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Price is required' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              placeholder="Price"
            />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="imageUrl"
            rules={[{ required: true, message: 'Image URL is required' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stockQuantity"
            rules={[{ required: true, message: 'Stock quantity is required' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
