import { authClient } from '@/lib/auth-client';
import { useAuthStore } from './store';

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({ email, password });
  if (error) throw new Error(error.message || 'Login failed');
  useAuthStore.getState().setUser(data.user);
  return data;
}

export async function logout() {
  await authClient.signOut();
  useAuthStore.getState().clearAuth();
}
