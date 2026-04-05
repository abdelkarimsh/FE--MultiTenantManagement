import httpClient from '../api/httpClient';

export const PRODUCT_IMAGE_PLACEHOLDER = 'https://via.placeholder.com/300x300.png?text=Product';

const isAbsoluteUrl = (value: string) =>
  /^https?:\/\//i.test(value) || value.startsWith('//') || value.startsWith('data:') || value.startsWith('blob:');

export const resolveMediaUrl = (value?: string | null): string | null => {
  if (!value) return null;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  if (isAbsoluteUrl(trimmedValue)) {
    return trimmedValue;
  }

  const base = import.meta.env.VITE_API_URL || httpClient.defaults.baseURL || window.location.origin;

  try {
    return new URL(trimmedValue, base).toString();
  } catch {
    return trimmedValue;
  }
};

export const resolveProductImageUrl = (value?: string | null, fallback = PRODUCT_IMAGE_PLACEHOLDER) =>
  resolveMediaUrl(value) ?? fallback;
