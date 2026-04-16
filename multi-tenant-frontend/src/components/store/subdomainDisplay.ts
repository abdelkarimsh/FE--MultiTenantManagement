const SUBDOMAIN_FALLBACK = 'Custom store link not available';
const LOCAL_HOST = 'localhost';
const LOCAL_LOOPBACKS = new Set(['localhost', '127.0.0.1', '::1']);

type LocationLike = Pick<Location, 'hostname' | 'port' | 'protocol'>;

const normalizeSubDomain = (subDomain?: string | null) => subDomain?.trim().toLowerCase() || '';

const isLocalEnvironmentHost = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  return LOCAL_LOOPBACKS.has(normalized) || normalized.endsWith('.localhost');
};

const getPortSuffix = (locationLike: LocationLike) => (locationLike.port ? `:${locationLike.port}` : '');

const getConfiguredRootDomain = () => {
  const configuredRootDomain = import.meta.env.VITE_STOREFRONT_ROOT_DOMAIN as string | undefined;
  return configuredRootDomain?.trim().toLowerCase() || null;
};

const deriveRootDomainFromHost = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  const parts = normalized.split('.').filter(Boolean);

  if (parts.length <= 2) {
    return normalized;
  }

  return parts.slice(1).join('.');
};

const resolveRootDomain = (locationLike: LocationLike) =>
  getConfiguredRootDomain() || deriveRootDomainFromHost(locationLike.hostname);

export const getCurrentHostnameSubdomain = (hostname: string = window.location.hostname): string | null => {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized || LOCAL_LOOPBACKS.has(normalized)) {
    return null;
  }

  if (normalized.endsWith('.localhost')) {
    const parts = normalized.split('.').filter(Boolean);
    return parts.length > 1 ? parts[0] : null;
  }

  const parts = normalized.split('.').filter(Boolean);
  return parts.length > 2 ? parts[0] : null;
};

export const buildStorefrontHost = (subDomain: string, locationLike: LocationLike = window.location): string => {
  const normalizedSubDomain = normalizeSubDomain(subDomain);
  if (!normalizedSubDomain) {
    return '';
  }

  if (isLocalEnvironmentHost(locationLike.hostname)) {
    return `${normalizedSubDomain}.${LOCAL_HOST}${getPortSuffix(locationLike)}`;
  }

  return `${normalizedSubDomain}.${resolveRootDomain(locationLike)}`;
};

export const buildStorefrontUrl = (
  subDomain?: string | null,
  path = '/store/products',
  locationLike: LocationLike = window.location,
): string | null => {
  const normalizedSubDomain = normalizeSubDomain(subDomain);
  if (!normalizedSubDomain) {
    return null;
  }

  const host = buildStorefrontHost(normalizedSubDomain, locationLike);
  if (!host) {
    return null;
  }

  return `${locationLike.protocol}//${host}${path}`;
};

export const formatStoreSubdomainDisplay = (
  subDomain?: string | null,
  locationLike: LocationLike = window.location,
): string => {
  const normalizedSubDomain = normalizeSubDomain(subDomain);
  if (!normalizedSubDomain) {
    return SUBDOMAIN_FALLBACK;
  }

  return buildStorefrontHost(normalizedSubDomain, locationLike) || SUBDOMAIN_FALLBACK;
};

