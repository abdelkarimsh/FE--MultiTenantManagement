export const ROUTES = {
  root: '/',
  login: '/login',
  superAdmin: {
    root: '/sa',
    dashboard: '/sa/dashboard',
    tenants: '/sa/tenants',
    users: '/sa/users',
    settings: '/sa/settings',
  },
  tenantAdmin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    products: '/admin/products',
    orders: '/admin/orders',
    settings: '/admin/settings',
  },
  store: {
    root: '/store',
    products: '/store/products',
    orders: '/store/orders',
  },
} as const;
