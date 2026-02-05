// src/layouts/StoreLayout.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StoreLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xl">🔔</span>
          <Link to="/" className="font-semibold text-lg">
            MultiTenant
          </Link>
        </div>

        {/* Tenant + User info */}
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
            {/* {currentTenantName ?? "Current Tenant"} */}
            Current Tenant
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-800">{user.email}</span>
            </div>
          )}
        </div>
      </header>


      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default StoreLayout;
