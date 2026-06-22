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

// ── Business Claims (mobile signup submissions awaiting admin review) ───

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'all';

export interface BusinessClaim {
  id: string;
  user_id: string;
  name: string | null;
  about: string | null;
  industry: string | null;
  ein_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  business_owner: boolean | null;
  business_niche: string | null;
  review_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  reviewed_at: string | null;
  claimant: {
    id: string | null;
    email: string | null;
    account_type: string | null;
    full_name: string | null;
    contact_phone: string | null;
  };
  submitted_at: string;
}

export interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  uploaded_at: string;
}

export interface BusinessClaimDetail extends BusinessClaim {
  mission: string | null;
  business_url: string | null;
  affiliated_company: string | null;
  related_company: string | null;
  social_links: { name: string; url: string }[];
  latitude: string | null;
  longitude: string | null;
  documents: ClaimDocument[];
}

export interface ClaimStats {
  pending: number;
  approved: number;
  rejected: number;
  pending_last_7d: number;
}

export interface BusinessClaimsListResponse {
  data: BusinessClaim[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export const claimsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClaimsStats: builder.query<ClaimStats, void>({
      query: () => '/admin/approvals/claims/stats',
      transformResponse: (r: ApiResponse<ClaimStats>) => r.data,
      providesTags: [{ type: 'Business', id: 'claims' }],
    }),

    listClaims: builder.query<
      BusinessClaimsListResponse,
      { search?: string; status?: ClaimStatus; page?: number; limit?: number }
    >({
      query: ({ search, status = 'PENDING', page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (status) p.set('status', status);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/approvals/claims?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<BusinessClaimsListResponse>) => r.data,
      providesTags: [{ type: 'Business', id: 'claims' }],
    }),

    getClaim: builder.query<BusinessClaimDetail, string>({
      query: (id) => `/admin/approvals/claims/${id}`,
      transformResponse: (r: ApiResponse<BusinessClaimDetail>) => r.data,
      providesTags: [{ type: 'Business', id: 'claims' }],
    }),

    approveClaim: builder.mutation<{ id: string; review_status: string }, string>({
      query: (id) => ({
        url: `/admin/approvals/claims/${id}/approve`,
        method: 'PATCH',
      }),
      transformResponse: (r: ApiResponse<{ id: string; review_status: string }>) => r.data,
      invalidatesTags: [{ type: 'Business', id: 'claims' }],
    }),

    rejectClaim: builder.mutation<
      { id: string; review_status: string },
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/approvals/claims/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string; review_status: string }>) => r.data,
      invalidatesTags: [{ type: 'Business', id: 'claims' }],
    }),
  }),
});

export const {
  useGetAdApprovalStatsQuery,
  useListPendingAdsQuery,
  useUpdateAdStatusMutation,
} = approvalsApi;

export const {
  useGetClaimsStatsQuery,
  useListClaimsQuery,
  useGetClaimQuery,
  useApproveClaimMutation,
  useRejectClaimMutation,
} = claimsApi;
