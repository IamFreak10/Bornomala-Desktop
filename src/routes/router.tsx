import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { POSPage } from '@/features/pos/pages/POSPage';
import { OrderListPage } from '@/features/orders/pages/OrderListPage';
import { PromosPage } from '@/features/promos/pages/PromosPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { BooksPage } from '@/features/books/pages/BooksPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { LoginForm } from '@/features/auth/components/LoginForm';
import PortectedRoute from '@/components/shared/PortectedRoute';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Main Dashboard Layout Shell & Template Routes */}
        <Route element={<PortectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/promos" element={<PromosPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Auth / Login Template */}
        <Route path="/login" element={<LoginForm />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}
