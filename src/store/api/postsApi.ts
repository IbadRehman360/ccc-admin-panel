import { baseApi, type ApiResponse } from './baseApi';

export interface PostRow {
  id: string;
  description: string | null;
  picture: string | null;
  media_type: 'Text' | 'Image';
  total_likes: number;
  total_comments: number;
  author: {
    id: string;
    email: string;
    full_name: string | null;
    user_type: string;
  } | null;
  community: { id: string; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface PostDetail extends PostRow {
  description: string | null; // full text
}

export interface PostStats {
  total: number;
  with_image: number;
  text_only: number;
  recent_7d: number;
  total_likes: number;
  total_comments: number;
}

export interface PostsListResponse {
  data: PostRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface PostsListQuery {
  search?: string;
  community_id?: string;
  media?: 'all' | 'text' | 'image';
  sort_by?: 'date' | 'likes' | 'comments';
  page?: number;
  limit?: number;
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPosts: builder.query<PostsListResponse, PostsListQuery>({
      query: ({ search, community_id, media, sort_by, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (community_id) p.set('community_id', community_id);
        if (media && media !== 'all') p.set('media', media);
        if (sort_by) p.set('sort_by', sort_by);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/posts?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<PostsListResponse>) => r.data,
      providesTags: ['Community'],
    }),
    getPostStats: builder.query<PostStats, void>({
      query: () => '/admin/posts/stats',
      transformResponse: (r: ApiResponse<PostStats>) => r.data,
      providesTags: ['Community'],
    }),
    getPostDetail: builder.query<PostDetail, string>({
      query: (id) => `/admin/posts/${id}`,
      transformResponse: (r: ApiResponse<PostDetail>) => r.data,
      providesTags: ['Community'],
    }),
    deletePost: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/posts/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
      invalidatesTags: ['Community'],
    }),
  }),
});

export const {
  useListPostsQuery,
  useGetPostStatsQuery,
  useGetPostDetailQuery,
  useDeletePostMutation,
} = postsApi;
