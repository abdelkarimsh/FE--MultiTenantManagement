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
    orderDetails: (orderId: string) => `/admin/orders/${orderId}`,
    settings: '/admin/settings',
  },
  store: {
    root: '/store',
    products: '/store/products',
    cart: '/store/cart',
    checkout: '/store/checkout',
    orders: '/store/orders',
    orderDetails: (orderId: string) => `/store/orders/${orderId}`,
    settings: '/store/settings',
  },
} as const;
