import React from 'react';
import { Spin } from 'antd';

const StoreLoadingState: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <Spin size="large" />
        <div className="mt-4 text-sm font-medium text-slate-700">Loading your storefront...</div>
      </div>
    </div>
  );
};

export default StoreLoadingState;
