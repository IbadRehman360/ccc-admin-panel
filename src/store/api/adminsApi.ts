import { baseApi, type ApiResponse } from './baseApi';

export interface AdminRow {
  id: string;
  email: string;
  full_name: string | null;
  is_blocked: boolean;
  status: 'Active' | 'Inactive';
  is_email_verified: boolean;
  last_login: string | null;
  created_at: string;
}

export interface AdminListResponse {
  data: AdminRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface AdminStats {
  total: number;
  active: number;
  inactive: number;
  recent_logins: number;
}

export interface CreateAdminBody {
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateAdminBody {
  id: string;
  email?: string;
  full_name?: string;
}

export interface AdminListQuery {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export const adminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdmins: builder.query<AdminListResponse, AdminListQuery>({
      query: ({ search, status, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status && status !== 'all') params.set('status', status);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/admin/admins?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<AdminListResponse>) =>
        response.data,
      providesTags: ['Admin'],
    }),

    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/admins/stats',
      transformResponse: (response: ApiResponse<AdminStats>) => response.data,
      providesTags: ['Admin'],
    }),

    createAdmin: builder.mutation<AdminRow, CreateAdminBody>({
      query: (body) => ({ url: '/admin/admins', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AdminRow>) => response.data,
      invalidatesTags: ['Admin'],
    }),

    updateAdmin: builder.mutation<AdminRow, UpdateAdminBody>({
      query: ({ id, ...body }) => ({
        url: `/admin/admins/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: ApiResponse<AdminRow>) => response.data,
      invalidatesTags: ['Admin'],
    }),

    setAdminStatus: builder.mutation<AdminRow, { id: string; is_blocked: boolean }>({
      query: ({ id, is_blocked }) => ({
        url: `/admin/admins/${id}/status`,
        method: 'PATCH',
        body: { is_blocked },
      }),
      transformResponse: (response: ApiResponse<AdminRow>) => response.data,
      invalidatesTags: ['Admin'],
    }),

    deleteAdmin: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/admin/admins/${id}`, method: 'DELETE' }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
      invalidatesTags: ['Admin'],
    }),

    resetAdminPassword: builder.mutation<
      { id: string },
      { id: string; new_password: string }
    >({
      query: ({ id, new_password }) => ({
        url: `/admin/admins/${id}/reset-password`,
        method: 'PATCH',
        body: { new_password },
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
    }),
  }),
});

export const {
  useListAdminsQuery,
  useGetAdminStatsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useSetAdminStatusMutation,
  useDeleteAdminMutation,
  useResetAdminPasswordMutation,
} = adminsApi;
