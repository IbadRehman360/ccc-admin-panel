import { baseApi, type ApiResponse } from './baseApi';

export type ScreenName =
  | 'USER_REQUESTS' | 'USER_INVITES' | 'JOB' | 'TRANSACTION_DEBIT'
  | 'TRANSACTION_CREDIT' | 'NEWS' | 'PROFILE' | 'COMMUNITY_NOTIFICATION'
  | 'EVENT_INVITE' | 'GEO_FENCING' | 'COMMUNITY_POST' | 'JOB_APPLIED'
  | 'JOB_APPLICATION' | 'ADVERTISEMENT';

export interface NotificationLog {
  id: string;
  title: string | null;
  message: string | null;
  screen_name: ScreenName | null;
  is_admin: boolean;
  is_read: boolean;
  recipient: {
    id: string;
    email: string;
    full_name: string | null;
    user_type: string;
  } | null;
  created_at: string;
}

export interface NotificationStats {
  total: number;
  today: number;
  last_7d: number;
  by_admin: number;
}

export interface NotificationsListResponse {
  data: NotificationLog[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface NotificationsListQuery {
  search?: string;
  screen_name?: ScreenName | 'all';
  is_admin?: 'all' | 'true' | 'false';
  page?: number;
  limit?: number;
}

export interface SendBroadcastBody {
  title: string;
  message: string;
  recipients: 'all' | 'users' | 'businesses' | 'specific';
  specific_user_ids?: string[];
  screen_name?: ScreenName;
  metadata?: Record<string, unknown>;
}

export interface SendBroadcastResult {
  recipients_total: number;
  sent: number;
  failed: number;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<NotificationsListResponse, NotificationsListQuery>({
      query: ({ search, screen_name, is_admin, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (screen_name && screen_name !== 'all') p.set('screen_name', screen_name);
        if (is_admin && is_admin !== 'all') p.set('is_admin', is_admin);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/notifications?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<NotificationsListResponse>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'notifications' }],
    }),
    getNotificationStats: builder.query<NotificationStats, void>({
      query: () => '/admin/notifications/stats',
      transformResponse: (r: ApiResponse<NotificationStats>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'notifications' }],
    }),
    sendBroadcast: builder.mutation<SendBroadcastResult, SendBroadcastBody>({
      query: (body) => ({
        url: '/admin/notifications/send',
        method: 'POST',
        body,
      }),
      transformResponse: (r: ApiResponse<SendBroadcastResult>) => r.data,
      invalidatesTags: [{ type: 'Auth' as const, id: 'notifications' }],
    }),
    deleteNotification: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/admin/notifications/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
      invalidatesTags: [{ type: 'Auth' as const, id: 'notifications' }],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetNotificationStatsQuery,
  useSendBroadcastMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
