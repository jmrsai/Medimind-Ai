
'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function useAuth() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { auth, user, loading };
}
