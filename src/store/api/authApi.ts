import { baseApi, type ApiResponse } from './baseApi';

export interface AdminUser {
  id: string;
  email: string;
  user_type: 'ADMIN';
  full_name: string | null;
  account_type: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  admin: AdminUser;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => response.data,
      invalidatesTags: ['Auth'],
    }),

    me: builder.query<AdminUser, void>({
      query: () => '/admin/auth/me',
      transformResponse: (response: ApiResponse<AdminUser>) => response.data,
      providesTags: ['Auth'],
    }),

    refresh: builder.mutation<{ access_token: string }, { refresh_token: string }>({
      query: (body) => ({
        url: '/admin/auth/refresh',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<{ access_token: string }>) =>
        response.data,
    }),

    logout: builder.mutation<void, { refresh_token: string }>({
      query: (body) => ({
        url: '/admin/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
