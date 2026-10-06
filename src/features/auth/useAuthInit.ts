import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useAuthStore } from './store';


export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        setLoading(true);
        const { data } = await authClient.getSession();
        if (isMounted) {
          setUser(data?.user ?? null);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading]);
}
