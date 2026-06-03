import { baseApi, type ApiResponse } from './baseApi';

export interface GeoUserRow {
  id: string;
  name: string;
  email: string;
  account_type: 'User' | 'Business';
  has_location: boolean;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address: string | null;
  has_fcm_token: boolean;
  last_active: string | null;
  joined_date: string;
}

export interface GeoStats {
  total: number;
  with_location: number;
  without_location: number;
  users_with_location: number;
  businesses_with_location: number;
  total_users: number;
  total_businesses: number;
}

export interface TopLocation {
  state: string;
  count: number;
}

export interface GeoUsersListResponse {
  data: GeoUserRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface GeoUsersListQuery {
  search?: string;
  account_type?: 'all' | 'USER' | 'BUSINESS';
  has_location?: 'all' | 'true' | 'false';
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}

export const geofencingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeoStats: builder.query<GeoStats, void>({
      query: () => '/admin/geofencing/stats',
      transformResponse: (r: ApiResponse<GeoStats>) => r.data,
    }),
    getTopLocations: builder.query<TopLocation[], number | void>({
      query: (limit) => `/admin/geofencing/top-locations${limit ? `?limit=${limit}` : ''}`,
      transformResponse: (r: ApiResponse<TopLocation[]>) => r.data,
    }),
    listGeoUsers: builder.query<GeoUsersListResponse, GeoUsersListQuery>({
      query: ({
        search, account_type, has_location, city, state, page = 1, limit = 20,
      }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (account_type && account_type !== 'all') p.set('account_type', account_type);
        if (has_location && has_location !== 'all') p.set('has_location', has_location);
        if (city) p.set('city', city);
        if (state) p.set('state', state);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/geofencing/users?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<GeoUsersListResponse>) => r.data,
    }),
  }),
});

export const {
  useGetGeoStatsQuery,
  useGetTopLocationsQuery,
  useListGeoUsersQuery,
} = geofencingApi;
