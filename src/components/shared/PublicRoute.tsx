import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  console.log(isAuthenticated, isLoading);
  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
