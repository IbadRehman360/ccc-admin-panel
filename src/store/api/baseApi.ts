import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  API_URL,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/lib/api/client';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set('Authorization', token);
    return headers;
  },
});

// In-flight refresh promise so concurrent 401s don't fire N refresh requests.
let refreshInflight: Promise<string | null> | null = null;

const tryRefresh = async (): Promise<string | null> => {
  if (refreshInflight) return refreshInflight;

  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  refreshInflight = (async () => {
    try {
      const res = await fetch(`${API_URL}/admin/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      });
      if (!res.ok) return null;
      const json: { data?: { access_token?: string } } = await res.json();
      const new_access = json?.data?.access_token;
      if (!new_access) return null;
      setTokens(new_access, refresh_token);
      return new_access;
    } catch {
      return null;
    } finally {
      refreshInflight = null;
    }
  })();

  return refreshInflight;
};

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && typeof window !== 'undefined') {
    // Don't try to refresh while refreshing/logging in/out
    const url = typeof args === 'string' ? args : args.url;
    const isAuthRoute = url.includes('/admin/auth/');

    if (!isAuthRoute) {
      const newToken = await tryRefresh();
      if (newToken) {
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }

    // Still 401 after refresh attempt — clear and redirect
    if (result.error?.status === 401) {
      clearTokens();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth', 'User', 'Business', 'Admin', 'Ad', 'Community'],
  endpoints: () => ({}),
});

export interface ApiResponse<T> {
  status: { code: number; success: boolean };
  data: T;
  error: string | null;
  message: string | string[];
}
