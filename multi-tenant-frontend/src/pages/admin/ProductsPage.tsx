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
  Upload,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../layouts/ProLayout/PageContainer';
import { getMutationErrorMessage, PRODUCT_OUTDATED_MESSAGE } from '../../api/apiErrors';
import { attachmentsApi } from '../../api/attachmentsApi';
import { productsApi } from '../../api/productsApi';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../../hooks/products/useProductMutations';
import { useTenantProductsQuery } from '../../hooks/products/useTenantProductsQuery';
import type { CreateProductRequest, ProductDto, UpdateProductRequest } from '../../types/product';
import { resolveProductImageUrl } from '../../utils/media';
import { resolveMediaUrl } from '../../utils/media';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  attachmentId?: string | null;
  version?: number;
  stockQuantity: number;
  isActive: boolean;
}

const ProductsPage: React.FC = () => {
  const [form] = Form.useForm<ProductFormValues>();
  const { currentTenantId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [uploadFailed, setUploadFailed] = useState(false);

  const { data, isLoading } = useTenantProductsQuery(currentTenantId, pageNumber, pageSize);
  const createMutation = useCreateProductMutation(currentTenantId);
  const updateMutation = useUpdateProductMutation(currentTenantId);
  const deleteMutation = useDeleteProductMutation(currentTenantId);

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      attachmentsApi.uploadAttachment(currentTenantId as string, {
        file,
        category: 'product',
        entityType: 'products',
        entityId: editingProduct?.id ?? 'new-product',
      }),
    onSuccess: (response) => {
      form.setFieldsValue({
        attachmentId: response.attachmentId,
        imageUrl: response.url,
      });
      setUploadFailed(false);
      message.success('Image uploaded successfully');
    },
    onError: (error: any) => {
      form.setFieldsValue({
        attachmentId: null,
        imageUrl: '',
      });
      setUploadFailed(true);
      message.error(error?.response?.data?.message || 'Image upload failed');
    },
  });

  const products = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const watchedImageUrl = Form.useWatch('imageUrl', form);
  const previewUrl = !uploadFailed ? resolveMediaUrl(watchedImageUrl) : null;

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const isUploading = uploadMutation.isPending;

  const resetModalState = () => {
    setEditingProduct(null);
    setSelectedImageName('');
    setUploadFailed(false);
    form.resetFields();
  };

  const handleAddClick = () => {
    resetModalState();
    form.setFieldsValue({
      isActive: true,
      stockQuantity: 0,
      price: 0,
      imageUrl: '',
      attachmentId: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductDto) => {
    setEditingProduct(product);
    setSelectedImageName('');
    setUploadFailed(false);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      attachmentId: product.attachmentId ?? null,
      version: product.version,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = async (product: ProductDto) => {
    if (typeof product.version === 'number') {
      openEditModal(product);
      return;
    }

    if (!currentTenantId) {
      message.error('Tenant context is missing');
      return;
    }

    try {
      const latestProduct = await productsApi.getProductById(currentTenantId, product.id);
      if (typeof latestProduct.version !== 'number') {
        message.error(PRODUCT_OUTDATED_MESSAGE);
        return;
      }

      openEditModal(latestProduct);
    } catch {
      message.error(PRODUCT_OUTDATED_MESSAGE);
    }
  };

  const handleImageUpload = (file: File) => {
    if (!currentTenantId) {
      message.error('Tenant context is missing');
      return;
    }

    setSelectedImageName(file.name);
    uploadMutation.mutate(file);
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      handleImageUpload(file as File);
      return false;
    },
  };

  const resolveProductVersion = async (product: ProductDto): Promise<number | null> => {
    if (typeof product.version === 'number') return product.version;

    if (!currentTenantId) return null;

    const latestProduct = await productsApi.getProductById(currentTenantId, product.id);
    if (typeof latestProduct.version !== 'number') return null;

    setEditingProduct((prev) => (prev?.id === product.id ? latestProduct : prev));
    form.setFieldsValue({ version: latestProduct.version });
    return latestProduct.version;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productValues = {
        name: values.name,
        description: values.description,
        price: values.price,
        attachmentId: values.attachmentId || null,
        imageUrl: values.imageUrl,
        stockQuantity: values.stockQuantity,
        isActive: values.isActive,
      };

      if (editingProduct) {
        let version: number | null = null;
        try {
          version = await resolveProductVersion(editingProduct);
        } catch {
          version = null;
        }

        if (typeof version !== 'number') {
          message.error(PRODUCT_OUTDATED_MESSAGE);
          return;
        }

        const updatePayload: UpdateProductRequest = {
          ...productValues,
          version,
        };

        updateMutation.mutate(
          { id: editingProduct.id, data: updatePayload },
          {
            onSuccess: () => {
              message.success('Product updated successfully');
              setIsModalOpen(false);
              resetModalState();
            },
            onError: (error: unknown) => {
              message.error(getMutationErrorMessage(error, 'Failed to update product'));
            },
          },
        );
        return;
      }

      if (!currentTenantId) {
        message.error('Tenant context is missing');
        return;
      }

      const createPayload: CreateProductRequest = {
        tenantId: currentTenantId,
        ...productValues,
      };

      createMutation.mutate(createPayload, {
        onSuccess: () => {
          message.success('Product created successfully');
          setIsModalOpen(false);
          resetModalState();
        },
        onError: (error: unknown) => {
          message.error(getMutationErrorMessage(error, 'Failed to create product'));
        },
      });
    } catch {
      // Validation errors are displayed by Form.Item.
    }
  };

  const handleDeleteProduct = async (product: ProductDto) => {
    let version: number | null = null;

    try {
      version = await resolveProductVersion(product);
    } catch {
      version = null;
    }

    if (typeof version !== 'number') {
      message.error(PRODUCT_OUTDATED_MESSAGE);
      return;
    }

    deleteMutation.mutate(
      { id: product.id, version },
      {
        onSuccess: () => {
          message.success('Product deleted successfully');
        },
        onError: (error: unknown) => {
          message.error(getMutationErrorMessage(error, 'Failed to delete product'));
        },
      },
    );
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
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete product?"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record)}
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
    <PageContainer header={{ title: 'Products' }}>
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
          <div style={{ textAlign: 'center', padding: 40 }}>Please select a tenant first.</div>
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
          resetModalState();
        }}
        onOk={handleSubmit}
        okButtonProps={{
          loading: createMutation.isPending || updateMutation.isPending,
          disabled: isUploading,
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
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} placeholder="Price" />
          </Form.Item>

          <Form.Item label="Product Image">
            <div className="space-y-3">
              <Space>
                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                    loading={isUploading}
                    disabled={!currentTenantId || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Select and Upload Image'}
                  </Button>
                </Upload>
                {selectedImageName && (
                  <span className="text-xs text-slate-500">Selected: {selectedImageName}</span>
                )}
              </Space>

              <Form.Item name="attachmentId" noStyle>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item name="version" noStyle>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item
                name="imageUrl"
                rules={[{ required: true, message: 'Please upload a product image' }]}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>

              {previewUrl && (
                <div className="flex items-center gap-3">
                  <img
                    src={resolveProductImageUrl(previewUrl)}
                    alt="Product preview"
                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                  <span className="text-xs text-slate-500">
                    Preview of the current product image.
                  </span>
                </div>
              )}
            </div>
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
