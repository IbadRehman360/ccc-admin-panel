import { baseApi, type ApiResponse } from './baseApi';

export interface MatchingUserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  account_type: 'User' | 'Business';
  profile_completion: number;
  preferences_set: boolean;
  preferences_count: number;
  joined_date: string;
  last_active: string | null;
  location: string | null;
}

export interface UserPreferences {
  id: string;
  name: string;
  email: string;
  account_type: 'User' | 'Business';
  is_preference_completed: boolean;
  preferences: { question_number: number; selected_options: string[] }[];
}

export interface PreferenceWeight {
  id: string;
  question_id: string;
  label: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface MatchingStats {
  total: number;
  total_with_prefs: number;
  total_without_prefs: number;
  users_with_prefs: number;
  businesses_with_prefs: number;
  total_users: number;
  total_businesses: number;
}

export interface MatchingUsersListResponse {
  data: MatchingUserRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface MatchingUsersListQuery {
  search?: string;
  account_type?: 'all' | 'USER' | 'BUSINESS';
  preferences_set?: 'all' | 'true' | 'false';
  page?: number;
  limit?: number;
}

export const matchingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMatchingUsers: builder.query<MatchingUsersListResponse, MatchingUsersListQuery>({
      query: ({ search, account_type, preferences_set, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (account_type && account_type !== 'all') p.set('account_type', account_type);
        if (preferences_set && preferences_set !== 'all') p.set('preferences_set', preferences_set);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/matching/users?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<MatchingUsersListResponse>) => r.data,
    }),
    getMatchingStats: builder.query<MatchingStats, void>({
      query: () => '/admin/matching/stats',
      transformResponse: (r: ApiResponse<MatchingStats>) => r.data,
    }),
    getUserPreferences: builder.query<UserPreferences, string>({
      query: (id) => `/admin/matching/users/${id}/preferences`,
      transformResponse: (r: ApiResponse<UserPreferences>) => r.data,
    }),
    getPreferenceWeights: builder.query<PreferenceWeight[], void>({
      query: () => '/admin/matching/weights',
      transformResponse: (r: ApiResponse<PreferenceWeight[]>) => r.data,
    }),
    updatePreferenceWeights: builder.mutation<
      PreferenceWeight[],
      { weights: { question_id: string; weight: number }[] }
    >({
      query: (body) => ({
        url: '/admin/matching/weights',
        method: 'PUT',
        body,
      }),
      transformResponse: (r: ApiResponse<PreferenceWeight[]>) => r.data,
    }),
  }),
});

export const {
  useListMatchingUsersQuery,
  useGetMatchingStatsQuery,
  useGetUserPreferencesQuery,
  useGetPreferenceWeightsQuery,
  useUpdatePreferenceWeightsMutation,
} = matchingApi;
