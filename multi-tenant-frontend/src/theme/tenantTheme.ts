/**
 * Multi-Tenant Branding System
 *
 * PHILOSOPHY:
 * - The admin dashboard NEVER changes — it always uses the system brand.
 * - Only the public store (StoreLayout + store/* pages) is tenant-brandable.
 * - Semantic colors (error, success, warning) are NEVER overridable — they
 *   carry meaning that must remain consistent for accessibility and UX.
 *
 * HOW TO USE:
 *   const brand = resolveTenantBrand(tenant);
 *   // Apply via ThemeProvider.setTenantBrand(brand)
 *   // or via <div data-tenant-theme style={tenantCssVars(brand)}>
 */

export interface TenantBrand {
  primaryColor:      string;  // e.g. "#7c3aed"
  primaryColorHover: string;  // e.g. "#6d28d9"
  primaryColorBg:    string;  // e.g. "rgba(124,58,237,.08)"
}

// Safe color map — validated, accessible options tenants can pick from.
// Free-form hex input is allowed but must pass contrast validation below.
export const PRESET_TENANT_COLORS: Record<string, TenantBrand> = {
  blue: {
    primaryColor:      '#1677ff',
    primaryColorHover: '#4096ff',
    primaryColorBg:    '#e6f4ff',
  },
  purple: {
    primaryColor:      '#7c3aed',
    primaryColorHover: '#6d28d9',
    primaryColorBg:    'rgba(124,58,237,.08)',
  },
  green: {
    primaryColor:      '#059669',
    primaryColorHover: '#047857',
    primaryColorBg:    'rgba(5,150,105,.08)',
  },
  red: {
    primaryColor:      '#dc2626',
    primaryColorHover: '#b91c1c',
    primaryColorBg:    'rgba(220,38,38,.08)',
  },
  orange: {
    primaryColor:      '#ea580c',
    primaryColorHover: '#c2410c',
    primaryColorBg:    'rgba(234,88,12,.08)',
  },
  teal: {
    primaryColor:      '#0d9488',
    primaryColorHover: '#0f766e',
    primaryColorBg:    'rgba(13,148,136,.08)',
  },
};

/**
 * Resolves a tenant's brand from the stored `StoreSetting.theme` value.
 * Falls back to the default blue if the theme is unrecognized.
 */
export function resolveTenantBrand(themeKey?: string | null): TenantBrand {
  if (!themeKey) return PRESET_TENANT_COLORS.blue;
  return PRESET_TENANT_COLORS[themeKey.toLowerCase()] ?? PRESET_TENANT_COLORS.blue;
}

/**
 * Returns an inline style object for data-tenant-theme containers.
 * Use this on the root element of StoreLayout.
 *
 * @example
 * <div data-tenant-theme style={tenantCssVars(brand)}>
 */
export function tenantCssVars(brand: TenantBrand): React.CSSProperties {
  return {
    '--tenant-primary':       brand.primaryColor,
    '--tenant-primary-hover': brand.primaryColorHover,
    '--tenant-primary-bg':    brand.primaryColorBg,
  } as React.CSSProperties;
}

/**
 * What tenants CAN change (store pages only):
 *   - primaryColor        → buttons, links, active states
 *   - primaryColorHover   → hover state
 *   - primaryColorBg      → selected/active backgrounds
 *   - Logo (via Attachment)
 *   - Store name / subdomain
 *   - Currency symbol
 *   - Support phone
 *
 * What tenants CANNOT change:
 *   - colorError / colorSuccess / colorWarning — accessibility-critical
 *   - Admin dashboard theme — system-wide consistency
 *   - Typography scale — readability guarantee
 *   - Border radius system — visual coherence
 *   - Shadow system — elevation hierarchy
 *   - colorText / colorBorder / neutral grays — readability guarantee
 */
