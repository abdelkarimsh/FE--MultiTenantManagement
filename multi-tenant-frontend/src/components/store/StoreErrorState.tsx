import React from 'react';
import { Button } from 'antd';

interface StoreErrorStateProps {
  onRetry: () => void;
}

const StoreErrorState: React.FC<StoreErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Unable to load storefront</div>
        <p className="mt-2 text-sm text-slate-500">
          We could not load your tenant storefront details. Please try again.
        </p>
        <Button type="primary" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
};

export default StoreErrorState;
