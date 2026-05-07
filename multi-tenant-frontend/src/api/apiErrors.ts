import axios from 'axios';

const STALE_ERROR_MESSAGE = 'This data was updated by someone else. Please refresh and try again.';

const staleStatuses = new Set([400, 409, 500]);
const staleTerms = ['stale', 'version', 'conflict', 'concurrency'];

const collectErrorText = (value: unknown): string[] => {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectErrorText);
  if (typeof value !== 'object') return [];

  return Object.values(value as Record<string, unknown>).flatMap(collectErrorText);
};

export const getApiErrorMessage = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : null;

  const data = error.response?.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }

  return error.message || null;
};

export const isStaleConcurrencyError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  if (!status || !staleStatuses.has(status)) return false;

  const searchableText = [
    error.message,
    ...collectErrorText(error.response?.data),
  ]
    .join(' ')
    .toLowerCase();

  return staleTerms.some((term) => searchableText.includes(term));
};

export const getMutationErrorMessage = (error: unknown, fallback: string): string => {
  if (isStaleConcurrencyError(error)) return STALE_ERROR_MESSAGE;
  return getApiErrorMessage(error) || fallback;
};

export const PRODUCT_OUTDATED_MESSAGE = 'Product data is outdated. Please refresh and try again.';
