import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Spin,
  Switch,
  Table,
  Tag,
  Space,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../../hooks/products/useProductMutations';
import { useTenantProductsQuery } from '../../hooks/products/useTenantProductsQuery';
import type { CreateProductRequest, ProductDto, UpdateProductRequest } from '../../types/product';

const ProductsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { currentTenantId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useTenantProductsQuery(currentTenantId, pageNumber, pageSize);
  const createMutation = useCreateProductMutation(currentTenantId);
  const updateMutation = useUpdateProductMutation(currentTenantId);
  const deleteMutation = useDeleteProductMutation(currentTenantId);

  const products = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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
          updateMutation.mutate(
            { id: editingProduct.id, data: payload },
            {
              onSuccess: () => {
                message.success('Product updated successfully');
                setIsModalOpen(false);
                setEditingProduct(null);
                form.resetFields();
              },
              onError: (error: any) => {
                message.error(error?.response?.data?.message || 'Failed to update product');
              },
            },
          );
          return;
        }

        createMutation.mutate(payload as CreateProductRequest, {
          onSuccess: () => {
            message.success('Product created successfully');
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Failed to create product');
          },
        });
      })
      .catch(() => {
        // Validation errors are displayed by Form.Item.
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
      render: (isActive: boolean) =>
        isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
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
            onConfirm={() =>
              deleteMutation.mutate(record.id, {
                onSuccess: () => {
                  message.success('Product deleted successfully');
                },
                onError: (error: any) => {
                  message.error(error?.response?.data?.message || 'Failed to delete product');
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
        title: 'Products',
        description: 'Manage tenant catalog items and inventory status.',
      }}
    >
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
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size);
              },
            }}
          />
        )}
      </Card>

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

          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProductsPage;

