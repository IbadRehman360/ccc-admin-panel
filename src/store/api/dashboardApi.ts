import { baseApi, type ApiResponse } from './baseApi';

export interface StatCard {
  value: number;
  change_pct: number | null;
}

export interface DashboardStats {
  total_users: StatCard & { active: number; inactive: number };
  total_businesses: StatCard & { verified: number; unverified: number };
  pending_approvals: StatCard & {
    claims: number;
    ads: number;
    communities: number;
  };
  active_jobs: StatCard & { applications: number };
  active_ads: StatCard & { impressions: number };
  reports: StatCard & { pending: number };
}

export interface DashboardCharts {
  daily_users: { date: string; users: number }[];
  monthly_users: { month: string; users: number }[];
  business_categories: { category: string; count: number }[];
  ads_performance: { month: string; impressions: number; clicks: number }[];
  jobs_data: { month: string; postings: number; applications: number }[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/stats',
      transformResponse: (response: ApiResponse<DashboardStats>) => response.data,
    }),
    getCharts: builder.query<DashboardCharts, void>({
      query: () => '/admin/dashboard/charts',
      transformResponse: (response: ApiResponse<DashboardCharts>) =>
        response.data,
    }),
  }),
});

export const { useGetStatsQuery, useGetChartsQuery } = dashboardApi;
