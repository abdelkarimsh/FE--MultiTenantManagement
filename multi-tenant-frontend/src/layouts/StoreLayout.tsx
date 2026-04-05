import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StoreErrorState from "../components/store/StoreErrorState";
import StoreFooter from "../components/store/StoreFooter";
import StoreHeader from "../components/store/StoreHeader";
import StoreLoadingState from "../components/store/StoreLoadingState";
import StorePageContainer from "../components/store/StorePageContainer";
import StoreSidebar from "../components/store/StoreSidebar";
import { StoreProvider, useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { ROUTES } from "../router/routes";

const StoreLayoutContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { tenant, isLoading, isError, refetch } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <StoreLoadingState />;
  }

  if (isError || !tenant) {
    return <StoreErrorState onRetry={() => void refetch()} />;
  }

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader
        tenant={tenant}
        user={user}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={handleLogout}
      />

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

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside
          className={`hidden shrink-0 transition-all duration-300 md:block ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="sticky top-24 h-[calc(100vh-7rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <StoreSidebar
              tenantName={tenant.displayName}
              tenantSubDomain={tenant.subDomain}
              tenantLogoUrl={tenant.logoUrl}
              collapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <Outlet />
        </section>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close storefront navigation"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-3 text-sm font-semibold text-slate-800">Navigation</div>
            <StoreSidebar
              tenantName={tenant.displayName}
              tenantSubDomain={tenant.subDomain}
              tenantLogoUrl={tenant.logoUrl}
              collapsed={false}
              showToggle={false}
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

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
