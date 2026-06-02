import { baseApi, type ApiResponse } from './baseApi';

export type ChatStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ChatUser {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string;
}

export interface ChatRow {
  id: number;
  status: ChatStatus | null;
  initiator: ChatUser | null;
  user_one: ChatUser | null;
  user_two: ChatUser | null;
  message_count: number;
  last_message: {
    message: string | null;
    attachment: string | null;
    sender_id: string;
    created_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  message: string | null;
  attachment: string | null;
  is_read: boolean;
  sender: { id: string; email: string; full_name: string | null } | null;
  recipient: { id: string; email: string; full_name: string | null } | null;
  created_at: string;
}

export interface ChatStats {
  total: number;
  pending: number;
  accepted: number;
  total_messages: number;
  blocked_pairs: number;
  recent_7d: number;
}

export interface ChatsListResponse {
  data: ChatRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface MessagesListResponse {
  data: ChatMessage[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface ChatsListQuery {
  search?: string;
  status?: ChatStatus | 'all';
  page?: number;
  limit?: number;
}

export const chatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listChats: builder.query<ChatsListResponse, ChatsListQuery>({
      query: ({ search, status, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (status && status !== 'all') p.set('status', status);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/chats?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<ChatsListResponse>) => r.data,
      providesTags: ['Community'],
    }),
    getChatStats: builder.query<ChatStats, void>({
      query: () => '/admin/chats/stats',
      transformResponse: (r: ApiResponse<ChatStats>) => r.data,
      providesTags: ['Community'],
    }),
    getChatMessages: builder.query<
      MessagesListResponse,
      { id: number; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 100 }) => {
        const p = new URLSearchParams();
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/chats/${id}/messages?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<MessagesListResponse>) => r.data,
    }),
    deleteChat: builder.mutation<{ id: number }, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/chats/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: number }>) => r.data,
      invalidatesTags: ['Community'],
    }),
  }),
});

export const {
  useListChatsQuery,
  useGetChatStatsQuery,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
} = chatsApi;
