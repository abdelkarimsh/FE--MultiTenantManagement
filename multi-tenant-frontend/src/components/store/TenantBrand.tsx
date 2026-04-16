import React from 'react';
import { formatStoreSubdomainDisplay } from './subdomainDisplay';

interface TenantBrandProps {
  name: string;
  subDomain?: string | null;
  logoUrl?: string | null;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

const TenantBrand: React.FC<TenantBrandProps> = ({ name, subDomain, logoUrl }) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {logoUrl ? (
          <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm font-semibold text-white">
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="truncate text-base font-semibold text-slate-900">{name}</div>
        <div className="truncate text-sm text-slate-500">
          {formatStoreSubdomainDisplay(subDomain)}
        </div>
      </div>
    </div>
  );
};

export default TenantBrand;
