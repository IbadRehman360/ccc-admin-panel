import { baseApi, type ApiResponse } from './baseApi';

export interface ReportUser {
  id: string;
  email: string;
  user_type: string;
  full_name: string | null;
  is_blocked: boolean;
}

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ReportRow {
  id: string;
  reporter: ReportUser | null;
  reported_user: ReportUser | null;
  reason_text: string | null;
  custom_reason: string | null;
  is_custom: boolean;
  effective_reason: string | null;
  status: ReportStatus;
  severity: ReportSeverity | null;
  admin_notes: string | null;
  action_taken: string | null;
  reviewed_by_id: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ReportStats {
  total: number;
  custom: number;
  predefined: number;
  last_7d: number;
  distinct_reported_users: number;
  pending: number;
  reviewed: number;
  resolved: number;
  dismissed: number;
  critical: number;
  high: number;
}

export interface ReportsListResponse {
  data: ReportRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface ReportsListQuery {
  search?: string;
  reason?: 'all' | 'custom' | 'predefined';
  status?: 'all' | ReportStatus;
  severity?: 'all' | ReportSeverity;
  page?: number;
  limit?: number;
}

export interface ReportUpdateBody {
  status?: ReportStatus;
  severity?: ReportSeverity | null;
  admin_notes?: string;
  action_taken?: string;
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReports: builder.query<ReportsListResponse, ReportsListQuery>({
      query: ({ search, reason, status, severity, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (reason && reason !== 'all') p.set('reason', reason);
        if (status && status !== 'all') p.set('status', status);
        if (severity && severity !== 'all') p.set('severity', severity);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/reports?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<ReportsListResponse>) => r.data,
    }),
    updateReport: builder.mutation<ReportRow, { id: string; body: ReportUpdateBody }>({
      query: ({ id, body }) => ({
        url: `/admin/reports/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (r: ApiResponse<ReportRow>) => r.data,
    }),
    getReportStats: builder.query<ReportStats, void>({
      query: () => '/admin/reports/stats',
      transformResponse: (r: ApiResponse<ReportStats>) => r.data,
    }),
    getReportDetail: builder.query<ReportRow, string>({
      query: (id) => `/admin/reports/${id}`,
      transformResponse: (r: ApiResponse<ReportRow>) => r.data,
    }),
    resolveReport: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/reports/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
    }),
  }),
});

export const {
  useListReportsQuery,
  useGetReportStatsQuery,
  useGetReportDetailQuery,
  useUpdateReportMutation,
  useResolveReportMutation,
} = reportsApi;
