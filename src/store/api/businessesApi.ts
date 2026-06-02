import { baseApi, type ApiResponse } from './baseApi';

export type BusinessType = 'DIVERSE' | 'CORPORATION' | 'HEALTHCARE' | 'EDUCATION';
export type BusinessStatus = 'Active' | 'Pending' | 'Suspended';

export interface BusinessRow {
  id: string;
  name: string;
  owner: string | null;
  owner_email: string;
  owner_phone: string | null;
  type: BusinessType | null;
  type_display: string | null;
  industry: string | null;
  location: string | null;
  verified: boolean;
  status: BusinessStatus;
  is_claimed: boolean;
  followers: number;
  joined_date: string;
  last_active_date: string | null;
}

export interface BusinessDetail extends BusinessRow {
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website: string | null;
  description: string | null;
  mission: string | null;
  ein_number: string | null;
  social_links: { name: string; url: string }[];
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_information_completed: boolean | null;
  is_visibility_and_certificates_completed: boolean | null;
  is_commitments_completed: boolean | null;
  is_esg_data_completed: boolean | null;
  account_type: string;
}

export interface BusinessDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  upload_date: string;
}

export interface BusinessStats {
  total: number;
  verified: number;
  unverified: number;
  pending: number;
  suspended: number;
}

export interface BusinessesListResponse {
  data: BusinessRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface BusinessesListQuery {
  search?: string;
  type?: BusinessType | 'all';
  status?: 'all' | 'active' | 'pending' | 'suspended';
  verified?: 'all' | 'verified' | 'unverified';
  sort_by?: 'date' | 'name' | 'followers' | 'verification';
  page?: number;
  limit?: number;
}

export const businessesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBusinesses: builder.query<BusinessesListResponse, BusinessesListQuery>({
      query: ({
        search, type, status, verified, sort_by, page = 1, limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (type && type !== 'all') params.set('type', type);
        if (status && status !== 'all') params.set('status', status);
        if (verified && verified !== 'all') params.set('verified', verified);
        if (sort_by) params.set('sort_by', sort_by);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/admin/businesses?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<BusinessesListResponse>) => response.data,
      providesTags: ['Business'],
    }),

    getBusinessStats: builder.query<BusinessStats, void>({
      query: () => '/admin/businesses/stats',
      transformResponse: (response: ApiResponse<BusinessStats>) => response.data,
      providesTags: ['Business'],
    }),

    getBusinessDetail: builder.query<BusinessDetail, string>({
      query: (id) => `/admin/businesses/${id}`,
      transformResponse: (response: ApiResponse<BusinessDetail>) => response.data,
      providesTags: ['Business'],
    }),

    getBusinessDocuments: builder.query<BusinessDocument[], string>({
      query: (id) => `/admin/businesses/${id}/documents`,
      transformResponse: (response: ApiResponse<BusinessDocument[]>) => response.data,
    }),

    verifyBusiness: builder.mutation<
      BusinessRow,
      { id: string; approved: boolean; notes?: string }
    >({
      query: ({ id, approved, notes }) => ({
        url: `/admin/businesses/${id}/verify`,
        method: 'PATCH',
        body: { approved, notes },
      }),
      transformResponse: (response: ApiResponse<BusinessRow>) => response.data,
      invalidatesTags: ['Business'],
    }),

    setBusinessStatus: builder.mutation<
      BusinessRow,
      { id: string; is_blocked: boolean; reason?: string }
    >({
      query: ({ id, is_blocked, reason }) => ({
        url: `/admin/businesses/${id}/status`,
        method: 'PATCH',
        body: { is_blocked, reason },
      }),
      transformResponse: (response: ApiResponse<BusinessRow>) => response.data,
      invalidatesTags: ['Business'],
    }),

    deleteBusiness: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/businesses/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
      invalidatesTags: ['Business'],
    }),
  }),
});

export const {
  useListBusinessesQuery,
  useGetBusinessStatsQuery,
  useGetBusinessDetailQuery,
  useGetBusinessDocumentsQuery,
  useVerifyBusinessMutation,
  useSetBusinessStatusMutation,
  useDeleteBusinessMutation,
} = businessesApi;
