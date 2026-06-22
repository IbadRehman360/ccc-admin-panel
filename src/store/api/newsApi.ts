import { baseApi, type ApiResponse } from './baseApi';

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  content_url: string;
  image_url: string | null;
  source: string | null;
  is_trending: boolean;
  is_featured: boolean;
  read_time_minutes: number;
  status: NewsStatus;
  published_at: string | null;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  trending: number;
  featured: number;
  created_last_7d: number;
}

export interface NewsListResponse {
  data: NewsArticle[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface NewsListQuery {
  search?: string;
  status?: NewsStatus | 'all';
  is_trending?: 'all' | 'true' | 'false';
  is_featured?: 'all' | 'true' | 'false';
  sort_by?: 'published' | 'created' | 'title';
  page?: number;
  limit?: number;
}

export interface NewsArticleInput {
  title: string;
  content_url: string;
  summary?: string;
  content?: string;
  image_url?: string;
  source?: string;
  is_trending?: boolean;
  is_featured?: boolean;
  read_time_minutes?: number;
  status?: NewsStatus;
}

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNews: builder.query<NewsListResponse, NewsListQuery>({
      query: ({
        search, status, is_trending, is_featured, sort_by, page = 1, limit = 20,
      }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (status && status !== 'all') p.set('status', status);
        if (is_trending && is_trending !== 'all') p.set('is_trending', is_trending);
        if (is_featured && is_featured !== 'all') p.set('is_featured', is_featured);
        if (sort_by) p.set('sort_by', sort_by);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/news?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<NewsListResponse>) => r.data,
    }),
    getNewsStats: builder.query<NewsStats, void>({
      query: () => '/admin/news/stats',
      transformResponse: (r: ApiResponse<NewsStats>) => r.data,
    }),
    getNewsDetail: builder.query<NewsArticle, string>({
      query: (id) => `/admin/news/${id}`,
      transformResponse: (r: ApiResponse<NewsArticle>) => r.data,
    }),
    createNews: builder.mutation<NewsArticle, NewsArticleInput>({
      query: (body) => ({ url: '/admin/news', method: 'POST', body }),
      transformResponse: (r: ApiResponse<NewsArticle>) => r.data,
    }),
    updateNews: builder.mutation<NewsArticle, { id: string; body: Partial<NewsArticleInput> }>({
      query: ({ id, body }) => ({ url: `/admin/news/${id}`, method: 'PATCH', body }),
      transformResponse: (r: ApiResponse<NewsArticle>) => r.data,
    }),
    deleteNews: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/news/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
    }),
  }),
});

export const {
  useListNewsQuery,
  useGetNewsStatsQuery,
  useGetNewsDetailQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
