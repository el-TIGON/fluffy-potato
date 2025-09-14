import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { onAuthChange } from '../services/auth';

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  return { user, loading };
};