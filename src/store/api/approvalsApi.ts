import { baseApi, type ApiResponse } from './baseApi';

export type AdStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface PendingAd {
  id: number;
  name: string;
  image: string;
  contact: string;
  url: string;
  status: AdStatus;
  is_paid: boolean;
  created_at: string;
  advertiser: {
    id: string | null;
    email: string | null;
    full_name: string | null;
    user_type: string | null;
  };
  schedule: {
    days: number;
    start: string | null;
    end: string | null;
  };
  engagement_count: number;
}

export interface PendingAdsListResponse {
  data: PendingAd[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface AdApprovalStats {
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  total: number;
}

export interface ListAdsQuery {
  status?: AdStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export const approvalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdApprovalStats: builder.query<AdApprovalStats, void>({
      query: () => '/admin/approvals/ads/stats',
      transformResponse: (response: ApiResponse<AdApprovalStats>) => response.data,
      providesTags: ['Ad'],
    }),

    listPendingAds: builder.query<PendingAdsListResponse, ListAdsQuery>({
      query: ({ status = 'PENDING', search, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (search) params.set('search', search);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/admin/approvals/ads?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<PendingAdsListResponse>) =>
        response.data,
      providesTags: ['Ad'],
    }),

    updateAdStatus: builder.mutation<
      PendingAd,
      { id: number; status: 'ACCEPTED' | 'REJECTED' | 'EXPIRED'; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/admin/approvals/ads/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      transformResponse: (response: ApiResponse<PendingAd>) => response.data,
      invalidatesTags: ['Ad'],
    }),
  }),
});

export const {
  useGetAdApprovalStatsQuery,
  useListPendingAdsQuery,
  useUpdateAdStatusMutation,
} = approvalsApi;
