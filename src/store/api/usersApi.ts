import { baseApi, type ApiResponse } from './baseApi';

export type UserStatus = 'Active' | 'Suspended';
export type ProfileStatus = 'Complete' | 'Incomplete';
export type VerificationStatus = 'Verified' | 'Unverified';

export interface UserRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  profile_status: ProfileStatus;
  completion: number;
  status: UserStatus;
  joined_date: string;
  last_active_date: string | null;
  verification_status: VerificationStatus;
  is_document_verified: boolean;
}

export interface UserDetail extends UserRow {
  bio: string | null;
  gender: string | null;
  profession: string | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  total_logins: number;
  community_memberships: number;
  events_attended: number;
  posts_created: number;
  account_type: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_profile_completed: boolean;
  is_preference_completed: boolean;
}

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  upload_date: string;
}

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  avg_completion_pct: number;
}

export interface UsersListResponse {
  data: UserRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface UsersListQuery {
  search?: string;
  status?: 'all' | 'active' | 'suspended';
  completion?: 'all' | 'complete' | 'incomplete';
  page?: number;
  limit?: number;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<UsersListResponse, UsersListQuery>({
      query: ({ search, status, completion, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status && status !== 'all') params.set('status', status);
        if (completion && completion !== 'all') params.set('completion', completion);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/admin/users?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<UsersListResponse>) => response.data,
      providesTags: ['User'],
    }),

    getUserStats: builder.query<UserStats, void>({
      query: () => '/admin/users/stats',
      transformResponse: (response: ApiResponse<UserStats>) => response.data,
      providesTags: ['User'],
    }),

    getUserDetail: builder.query<UserDetail, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: ApiResponse<UserDetail>) => response.data,
      providesTags: ['User'],
    }),

    getUserDocuments: builder.query<UserDocument[], string>({
      query: (id) => `/admin/users/${id}/documents`,
      transformResponse: (response: ApiResponse<UserDocument[]>) => response.data,
    }),

    setUserStatus: builder.mutation<
      UserRow,
      { id: string; is_blocked: boolean; reason?: string }
    >({
      query: ({ id, is_blocked, reason }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { is_blocked, reason },
      }),
      transformResponse: (response: ApiResponse<UserRow>) => response.data,
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserStatsQuery,
  useGetUserDetailQuery,
  useGetUserDocumentsQuery,
  useSetUserStatusMutation,
  useDeleteUserMutation,
} = usersApi;
