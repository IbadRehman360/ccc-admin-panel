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

// ── Geofence Zones ──────────────────────────────────────────────────────

export type ZoneShape = 'CIRCLE' | 'POLYGON';
export type ZoneStatus = 'ACTIVE' | 'INACTIVE';

export interface PolygonPoint { lat: number; lng: number }

export interface NotificationTemplate {
  title: string;
  message: string;
  screen_name?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  description: string | null;
  status: ZoneStatus;
  shape: ZoneShape;
  center_lat: number | null;
  center_lng: number | null;
  radius_meters: number | null;
  polygon_coords: PolygonPoint[] | null;
  notification_template: NotificationTemplate | null;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInZone {
  id: string;
  email: string;
  user_type: string;
  name: string;
  latitude: number;
  longitude: number;
  has_fcm_token: boolean;
  last_session_at: string | null;
}

export interface ZonesListResponse {
  data: GeofenceZone[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface UsersInZoneResponse {
  zone_id: string;
  data: UserInZone[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface ZoneInput {
  name: string;
  description?: string;
  status?: ZoneStatus;
  shape: ZoneShape;
  center_lat?: number;
  center_lng?: number;
  radius_meters?: number;
  polygon_coords?: PolygonPoint[];
  notification_template?: NotificationTemplate | null;
}

export interface BroadcastBody {
  title: string;
  message: string;
  screen_name?: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastResult {
  recipients_total: number;
  sent: number;
  failed: number;
}

export const zonesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listZones: builder.query<
      ZonesListResponse,
      { search?: string; status?: ZoneStatus | 'all'; page?: number; limit?: number }
    >({
      query: ({ search, status, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (status && status !== 'all') p.set('status', status);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/geofencing/zones?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<ZonesListResponse>) => r.data,
    }),
    getZone: builder.query<GeofenceZone, string>({
      query: (id) => `/admin/geofencing/zones/${id}`,
      transformResponse: (r: ApiResponse<GeofenceZone>) => r.data,
    }),
    createZone: builder.mutation<GeofenceZone, ZoneInput>({
      query: (body) => ({ url: '/admin/geofencing/zones', method: 'POST', body }),
      transformResponse: (r: ApiResponse<GeofenceZone>) => r.data,
    }),
    updateZone: builder.mutation<GeofenceZone, { id: string; body: Partial<ZoneInput> }>({
      query: ({ id, body }) => ({
        url: `/admin/geofencing/zones/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (r: ApiResponse<GeofenceZone>) => r.data,
    }),
    deleteZone: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/admin/geofencing/zones/${id}`, method: 'DELETE' }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
    }),
    getUsersInZone: builder.query<UsersInZoneResponse, { id: string; page?: number; limit?: number }>({
      query: ({ id, page = 1, limit = 50 }) =>
        `/admin/geofencing/zones/${id}/users?page=${page}&limit=${limit}`,
      transformResponse: (r: ApiResponse<UsersInZoneResponse>) => r.data,
    }),
    broadcastToZone: builder.mutation<BroadcastResult, { id: string; body: BroadcastBody }>({
      query: ({ id, body }) => ({
        url: `/admin/geofencing/zones/${id}/broadcast`,
        method: 'POST',
        body,
      }),
      transformResponse: (r: ApiResponse<BroadcastResult>) => r.data,
    }),
  }),
});

export const {
  useGetGeoStatsQuery,
  useGetTopLocationsQuery,
  useListGeoUsersQuery,
} = geofencingApi;

export const {
  useListZonesQuery,
  useGetZoneQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
  useGetUsersInZoneQuery,
  useBroadcastToZoneMutation,
} = zonesApi;
