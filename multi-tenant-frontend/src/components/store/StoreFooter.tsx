import React from 'react';
import type { StorefrontTenantView } from '../../types/tenant';

interface StoreFooterProps {
  tenant: StorefrontTenantView;
}

const StoreFooter: React.FC<StoreFooterProps> = ({ tenant }) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>{tenant.displayName}</span>
        <span>{tenant.supportPhone ? `Support: ${tenant.supportPhone}` : 'Support details unavailable'}</span>
      </div>
    </footer>
  );
};

export default StoreFooter;
