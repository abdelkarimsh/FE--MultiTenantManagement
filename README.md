# StoreFlow Multi-Tenant Management Frontend

A scalable multi-tenant SaaS storefront platform enabling role-based management for administrators and seamless shopping experiences for customers.


## 1. Project Title

**StoreFlow Multi-Tenant Management Frontend**

## 2. Overview

StoreFlow is a frontend application for managing multiple tenant storefronts from a single platform. It provides separate experiences for:

- Public visitors browsing marketing pages
- System administrators managing tenants and cross-tenant users
- Tenant administrators managing store users, products, orders, and store settings
- Tenant users/customers browsing storefront products, using a cart, checking out, and tracking orders

### What it does

- Centralizes multi-tenant store operations in one role-aware web application
- Connects to a backend API for authentication, tenants, users, products, orders, and file attachments

### Problem it solves

- Reduces operational fragmentation by combining tenant management, store administration, and customer storefront flows in a unified UI

### Who it is for

- Teams building a multi-tenant ecommerce/store management platform
- Developers needing a frontend client for a tenant-aware REST API

## 3. Architecture

This repository contains the frontend client only. Backend and database code are not included in this repo.

### System design

```text
Public Site
  -> Marketing pages and login entrypoint

Authentication Layer
  -> Login
  -> Role normalization
  -> Token persistence (localStorage)
  -> Route protection and role-based redirects

Admin Consoles
  -> System Admin area (/sa)
  -> Tenant Admin area (/admin)

Tenant Storefront
  -> Tenant context loading
  -> Product browsing
  -> Cart and checkout
  -> Order history and order details
```

### Technologies used

| Area | Technologies |
|---|---|
| App framework | React 19, TypeScript, Vite |
| UI | Ant Design, Tailwind CSS |
| Data fetching | TanStack React Query |
| HTTP | Axios |
| Routing | React Router |
| Tooling | ESLint, TypeScript compiler, React Compiler plugin |

### Layers in this frontend

| Layer | Purpose |
|---|---|
| `api/` | REST clients for all backend resources |
| `context/` | Auth, store tenant, and cart state |
| `hooks/` | Query/mutation abstraction for pages/components |
| `pages/` | Route-level feature screens |
| `layouts/` | Public, admin, and store application shells |
| `router/` | Routes, protected access, and menu config |
| `types/` | DTOs and shared frontend domain types |
| `utils/` | Subdomain and media helpers |

## 4. Features

- Role-based access and routing for `SystemAdmin`, `TenantAdmin`, and `User`
- Public pages: Home, About, Features
- Login with JWT token storage and guarded routes
- Tenant-aware store context and subdomain URL helpers
- Super Admin tenant management:
- List/search/sort tenants
- Create, edit, delete tenants
- Super Admin user management across tenants
- Tenant Admin user management scoped by current tenant
- Tenant Admin product management:
- List/create/update/delete products
- Product image upload via attachment API
- Tenant Admin order operations:
- Paginated order list
- Status/search/customer filtering
- Order detail review
- Approve/reject pending orders
- Storefront customer flow:
- Browse/search products
- Add to cart and adjust quantities
- Checkout and create order
- View order list/details/status history
- Cancel eligible orders
- Tenant store settings update page

## 5. Tech Stack

### Backend (integrated externally)

- REST API (expected external service)
- Bearer token authentication
- Configurable API base URL

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Ant Design
- Tailwind CSS

### Database

- Not present in this repository (backend-owned)

### Tools / Libraries

- `@tanstack/react-query`
- `axios`
- `react-hook-form` (dependency present)
- `eslint`
- `postcss`
- `autoprefixer`

## 6. Project Structure

```text
FE--MultiTenantManagement/
├─ multi-tenant-frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ router/
│  │  ├─ theme/
│  │  ├─ types/
│  │  └─ utils/
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ tailwind.config.js
├─ .gitignore
└─ package-lock.json
```

### Directory notes

- `multi-tenant-frontend/src/api`: Axios service modules by domain
- `multi-tenant-frontend/src/context`: App-wide auth/cart/store providers
- `multi-tenant-frontend/src/hooks`: Reusable query and mutation hooks
- `multi-tenant-frontend/src/pages/sa`: Super Admin pages
- `multi-tenant-frontend/src/pages/admin`: Tenant Admin pages
- `multi-tenant-frontend/src/pages/store`: Storefront pages
- `multi-tenant-frontend/src/router`: Route map and role-based route protection

## 7. API Overview

The frontend expects the following backend endpoints.

### Authentication

| Method | Endpoint |
|---|---|
| `POST` | `/Authentication/Login` |
| `GET` | `/Authentication/GetUserTenant` |

### Tenants

| Method | Endpoint |
|---|---|
| `GET` | `/Tenants/GetTenants` |
| `POST` | `/Tenants/CreateTenant` |
| `GET` | `/Tenants/Tenant/{tenantId}` |
| `PUT` | `/Tenants/UpdateTenant/{tenantId}` |
| `DELETE` | `/Tenants/Tenant/{tenantId}` |

### Users

| Method | Endpoint |
|---|---|
| `GET` | `/Users/GetUsers` |
| `GET` | `/Users/Users/{userId}` |
| `POST` | `/Users/CreateUser` |
| `PUT` | `/Users/UpdateUser/{userId}` |
| `DELETE` | `/Users/DeleteUser/{userId}` |

### Products

| Method | Endpoint |
|---|---|
| `GET` | `/tenants/{tenantId}/products` |
| `GET` | `/tenants/{tenantId}/products/{productId}` |
| `POST` | `/tenants/{tenantId}/products` |
| `PUT` | `/tenants/{tenantId}/products/{productId}` |
| `DELETE` | `/tenants/{tenantId}/products/{productId}` |

### Attachments

| Method | Endpoint |
|---|---|
| `POST` | `/tenants/{tenantId}/attachments/upload` |

### Orders

| Method | Endpoint |
|---|---|
| `GET` | `/tenants/{tenantId}/orders` |
| `GET` | `/tenants/{tenantId}/orders/CustomerOrders` |
| `POST` | `/tenants/{tenantId}/orders` |
| `GET` | `/tenants/{tenantId}/orders/{orderId}` |
| `POST` | `/tenants/{tenantId}/orders/{orderId}/cancel` |
| `POST` | `/tenants/{tenantId}/orders/{orderId}/approve` |
| `POST` | `/tenants/{tenantId}/orders/{orderId}/reject` |

### Example request/response

```json
// POST /Authentication/Login (request)
{
  "email": "admin@store.com",
  "password": "Password123!"
}
```

```json
// Login response (example shape)
{
  "accessToken": "jwt-token",
  "expiresAtUtc": "2026-04-16T12:00:00Z",
  "email": "admin@store.com",
  "userRole": "TenantAdmin",
  "tenantId": "tenant-guid",
  "fullName": "Store Admin"
}
```

## 8. Getting Started

### 1. Clone repository

```bash
git clone <repository-url>
cd FE--MultiTenantManagement/multi-tenant-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in `multi-tenant-frontend/`:

```env
VITE_API_URL=https://localhost:7114/api
VITE_STOREFRONT_ROOT_DOMAIN=localhost
```

### 4. Run frontend

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

## 9. Usage

### Typical flow

1. User signs in on `/login`
2. App redirects by role:
3. `SystemAdmin` -> `/sa/tenants`
4. `TenantAdmin` -> `/admin/dashboard`
5. `User` -> tenant storefront `/store/products` (or tenant subdomain storefront URL)
6. Tenant admin manages users/products/orders/settings
7. Tenant user browses products -> adds to cart -> checkout -> tracks orders

## 10. Screens / Demo

Main UI surfaces implemented:

- Public marketing pages (Home/About/Features)
- Login screen
- Super Admin console (`/sa/*`)
- Tenant Admin console (`/admin/*`)
- Storefront (`/store/*`) including products, cart, checkout, orders, and order details

## 11. Key Design Decisions

- Frontend-only repository with explicit backend contract through typed API modules
- Role-based route protection through `ProtectedRoute` and normalized role mapping
- Tenant-aware behavior built around auth tenant context and `StoreContext`
- Query-driven data synchronization using TanStack Query (cache + invalidation)
- Modular page/layout separation for public, admin, and storefront experiences
- Subdomain utility support for tenant storefront addressing

## 12. Future Improvements

- Add automated test coverage for role routing and critical order flows
- Add `.env.example` with full configuration reference
- Expand analytics/dashboard pages beyond placeholder content
- Improve API error standardization and retry UX
- Add CI pipeline checks (lint/build/test)

## 13. Author

- abdalkareem `<abdelkarimshar99@gmail.com>`

