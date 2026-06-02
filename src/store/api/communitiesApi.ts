import { baseApi, type ApiResponse } from './baseApi';

export type CommunityPrivacy = 'PUBLIC' | 'PRIVATE';

export interface CommunityRow {
  id: string;
  name: string;
  image: string | null;
  privacy: CommunityPrivacy;
  member_count: number;
  member_limit: number;
  posts_count: number;
  events_count: number;
  requests_count: number;
  creator: {
    id: string | null;
    email: string | null;
    full_name: string | null;
  };
  is_esg: boolean;
  is_dei: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityDetail extends CommunityRow {
  rules_and_guidelines: string | null;
  is_preferences_completed: boolean;
  is_subscribed: boolean;
}

export interface CommunityStats {
  total: number;
  public: number;
  private: number;
  created_last_7d: number;
}

export interface CommunitiesListResponse {
  data: CommunityRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface CommunitiesListQuery {
  search?: string;
  privacy?: CommunityPrivacy | 'all';
  sort_by?: 'date' | 'members' | 'name';
  page?: number;
  limit?: number;
}

export const communitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCommunities: builder.query<CommunitiesListResponse, CommunitiesListQuery>({
      query: ({ search, privacy, sort_by, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (privacy && privacy !== 'all') params.set('privacy', privacy);
        if (sort_by) params.set('sort_by', sort_by);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/admin/communities?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<CommunitiesListResponse>) => response.data,
      providesTags: ['Community'],
    }),

    getCommunityStats: builder.query<CommunityStats, void>({
      query: () => '/admin/communities/stats',
      transformResponse: (response: ApiResponse<CommunityStats>) => response.data,
      providesTags: ['Community'],
    }),

    getCommunityDetail: builder.query<CommunityDetail, string>({
      query: (id) => `/admin/communities/${id}`,
      transformResponse: (response: ApiResponse<CommunityDetail>) => response.data,
      providesTags: ['Community'],
    }),

    deleteCommunity: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/communities/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
      invalidatesTags: ['Community'],
    }),
  }),
});

export const {
  useListCommunitiesQuery,
  useGetCommunityStatsQuery,
  useGetCommunityDetailQuery,
  useDeleteCommunityMutation,
} = communitiesApi;
