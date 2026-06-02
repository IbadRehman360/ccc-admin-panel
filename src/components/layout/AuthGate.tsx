'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';
import { getAccessToken, clearTokens } from '@/lib/api/client';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // Read token only after mount to avoid SSR/CSR mismatch
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    setHasToken(!!getAccessToken());
  }, []);

  const { data, error } = useMeQuery(undefined, {
    skip: !hasToken || isAuthenticated,
  });

  useEffect(() => {
    if (hasToken === false) {
      router.replace('/login');
    }
  }, [hasToken, router]);

  useEffect(() => {
    if (data) dispatch(setCredentials({ admin: data }));
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      clearTokens();
      dispatch(clearCredentials());
      router.replace('/login');
    }
  }, [error, dispatch, router]);

  // Pre-mount or no token: render nothing (router will redirect)
  if (hasToken === null || hasToken === false) {
    return null;
  }

  // Has token — render layout immediately. Page-level queries show their own skeletons.
  // /me runs in the background to populate admin name in header.
  return <>{children}</>;
}
