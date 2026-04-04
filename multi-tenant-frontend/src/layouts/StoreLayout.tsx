import React from "react";
import { Outlet } from "react-router-dom";
import StoreErrorState from "../components/store/StoreErrorState";
import StoreFooter from "../components/store/StoreFooter";
import StoreHeader from "../components/store/StoreHeader";
import StoreLoadingState from "../components/store/StoreLoadingState";
import StorePageContainer from "../components/store/StorePageContainer";
import { StoreProvider, useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const StoreLayoutContent: React.FC = () => {
  const { user } = useAuth();
  const { tenant, isLoading, isError, refetch } = useStore();

  if (isLoading) {
    return <StoreLoadingState />;
  }

  if (isError || !tenant) {
    return <StoreErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader tenant={tenant} user={user} />

      {!tenant.isActive && (
        <div className="border-b border-amber-200 bg-amber-50 py-3 text-sm text-amber-800">
          <StorePageContainer>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span>Store status: {tenant.statusLabel}</span>
              <span>The storefront remains visible while status-specific handling is prepared.</span>
            </div>
          </StorePageContainer>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <StoreFooter tenant={tenant} />
    </div>
  );
};

const StoreLayout: React.FC = () => {
  return (
    <StoreProvider>
      <CartProvider>
        <StoreLayoutContent />
      </CartProvider>
    </StoreProvider>
  );
};

export default StoreLayout;
