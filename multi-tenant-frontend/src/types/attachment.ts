export interface AttachmentUploadResponse {
  attachmentId: string;
  url: string;
  originalFileName: string;
  contentType: string;
  storageProvider: string;
}

export interface UploadAttachmentRequest {
  file: File;
  category?: string;
  entityType?: string;
  entityId?: string;
}
