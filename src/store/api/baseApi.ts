import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, getAccessToken, clearTokens } from '@/lib/api/client';
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

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && typeof window !== 'undefined') {
    clearTokens();
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
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
