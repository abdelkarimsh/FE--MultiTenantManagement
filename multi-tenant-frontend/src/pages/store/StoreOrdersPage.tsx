import React from "react";
import StorePageContainer from "../../components/store/StorePageContainer";
import { useStore } from "../../context/StoreContext";

const StoreOrdersPage: React.FC = () => {
  const { tenant } = useStore();

  return (
    <StorePageContainer>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-500">
          Orders for {tenant?.displayName ?? 'your storefront'} will appear here.
        </p>
      </div>
    </StorePageContainer>
  );
};

export default StoreOrdersPage;
