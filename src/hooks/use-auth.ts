
'use client';
import { useState, useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = useMemo(() => getAuth(app), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { auth, user, loading };
}
