import httpClient from './httpClient';
import type { AttachmentUploadResponse, UploadAttachmentRequest } from '../types/attachment';

export const attachmentsApi = {
  uploadAttachment: async (
    tenantId: string,
    payload: UploadAttachmentRequest,
  ): Promise<AttachmentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('Category', payload.category ?? 'product');
    formData.append('EntityType', payload.entityType ?? 'products');
    formData.append('EntityId', payload.entityId ?? 'new-product');

    const response = await httpClient.post<AttachmentUploadResponse>(
      `/tenants/${tenantId}/attachments/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};
