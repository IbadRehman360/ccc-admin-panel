import { baseApi, type ApiResponse } from './baseApi';

export type EventPrivacy = 'PUBLIC' | 'PRIVATE';
export type EventStatus = 'Upcoming' | 'Live' | 'Past' | 'Cancelled';
export type AttendeeStatus = 'GOING' | 'MAYBE' | 'NOTGOING' | 'PENDING';

export interface EventRow {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  location: string | null;
  is_online: boolean;
  privacy: EventPrivacy;
  is_free: boolean;
  price: number;
  event_date: string;
  event_time: string;
  status: EventStatus;
  total_member_count: number;
  interested_member_count: number;
  going_count: number;
  maybe_count: number;
  favorites_count: number;
  invites_count: number;
  community: { id: string; name: string } | null;
  organizer: { id: string; email: string; full_name: string | null } | null;
  created_at: string;
}

export interface EventDetail extends EventRow {
  event_url: string | null;
  latitude: string | null;
  longitude: string | null;
  custom_reason: string | null;
  is_esg: boolean;
  is_dei: boolean;
}

export interface EventAttendee {
  id: string;
  user: { id: string; email: string; full_name: string | null } | null;
  status: AttendeeStatus;
  joined_date: string;
}

export interface EventStats {
  total: number;
  upcoming: number;
  live: number;
  past: number;
  cancelled: number;
}

export interface EventsListResponse {
  data: EventRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface AttendeesListResponse {
  data: EventAttendee[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface EventsListQuery {
  search?: string;
  privacy?: EventPrivacy | 'all';
  status?: 'all' | 'upcoming' | 'live' | 'past' | 'cancelled';
  sort_by?: 'date' | 'members' | 'name';
  page?: number;
  limit?: number;
}

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query<EventsListResponse, EventsListQuery>({
      query: ({ search, privacy, status, sort_by, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (privacy && privacy !== 'all') p.set('privacy', privacy);
        if (status && status !== 'all') p.set('status', status);
        if (sort_by) p.set('sort_by', sort_by);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/events?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<EventsListResponse>) => r.data,
      providesTags: ['Community'],
    }),
    getEventStats: builder.query<EventStats, void>({
      query: () => '/admin/events/stats',
      transformResponse: (r: ApiResponse<EventStats>) => r.data,
      providesTags: ['Community'],
    }),
    getEventDetail: builder.query<EventDetail, string>({
      query: (id) => `/admin/events/${id}`,
      transformResponse: (r: ApiResponse<EventDetail>) => r.data,
      providesTags: ['Community'],
    }),
    getEventAttendees: builder.query<
      AttendeesListResponse,
      { id: string; status?: 'all' | AttendeeStatus; page?: number; limit?: number }
    >({
      query: ({ id, status, page = 1, limit = 50 }) => {
        const p = new URLSearchParams();
        if (status && status !== 'all') p.set('status', status);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/events/${id}/attendees?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<AttendeesListResponse>) => r.data,
    }),
    cancelEvent: builder.mutation<EventRow, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/events/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<EventRow>) => r.data,
      invalidatesTags: ['Community'],
    }),
    deleteEvent: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/events/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
      invalidatesTags: ['Community'],
    }),
  }),
});

export const {
  useListEventsQuery,
  useGetEventStatsQuery,
  useGetEventDetailQuery,
  useGetEventAttendeesQuery,
  useCancelEventMutation,
  useDeleteEventMutation,
} = eventsApi;
