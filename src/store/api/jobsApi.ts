import { baseApi, type ApiResponse } from './baseApi';

export type JobStatus = 'ACTIVE' | 'CLOSED' | 'PAST';
export type JobType =
  | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY'
  | 'VOLUNTEER' | 'INTERSHIP' | 'OTHER';
export type ApplicationStatus = 'PENDING' | 'REJECTED' | 'HIRED';

export interface JobRow {
  id: string;
  title: string;
  position: string;
  description: string | null;
  job_type: JobType;
  job_status: JobStatus;
  location: string | null;
  specialization: string | null;
  experience: string | null;
  is_esg: boolean;
  is_dei: boolean;
  is_deleted: boolean;
  applications_count: number;
  favorites_count: number;
  posted_by: {
    id: string;
    email: string;
    user_type: string;
    full_name: string | null;
    business_name: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface JobDetail extends JobRow {
  description: string;
  qualification: string;
  requirements: string;
  facilities: string;
  latitude: string | null;
  longitude: string | null;
}

export interface JobApplicant {
  id: string;
  full_name: string | null;
  email_address: string | null;
  phone_number: string | null;
  resume_file: string | null;
  cover_letter_file: string | null;
  application_status: ApplicationStatus;
  applicant: { id: string; email: string; full_name: string | null } | null;
  created_at: string;
}

export interface JobStats {
  total: number;
  active: number;
  closed: number;
  past: number;
  total_applications: number;
}

export interface JobsListResponse {
  data: JobRow[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface ApplicantsListResponse {
  data: JobApplicant[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
}

export interface JobsListQuery {
  search?: string;
  status?: JobStatus | 'all';
  type?: JobType | 'all';
  sort_by?: 'date' | 'applications' | 'title';
  page?: number;
  limit?: number;
}

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listJobs: builder.query<JobsListResponse, JobsListQuery>({
      query: ({ search, status, type, sort_by, page = 1, limit = 20 }) => {
        const p = new URLSearchParams();
        if (search) p.set('search', search);
        if (status && status !== 'all') p.set('status', status);
        if (type && type !== 'all') p.set('type', type);
        if (sort_by) p.set('sort_by', sort_by);
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/jobs?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<JobsListResponse>) => r.data,
      providesTags: ['Community'],
    }),
    getJobStats: builder.query<JobStats, void>({
      query: () => '/admin/jobs/stats',
      transformResponse: (r: ApiResponse<JobStats>) => r.data,
      providesTags: ['Community'],
    }),
    getJobDetail: builder.query<JobDetail, string>({
      query: (id) => `/admin/jobs/${id}`,
      transformResponse: (r: ApiResponse<JobDetail>) => r.data,
      providesTags: ['Community'],
    }),
    getJobApplications: builder.query<
      ApplicantsListResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 50 }) => {
        const p = new URLSearchParams();
        p.set('page', String(page));
        p.set('limit', String(limit));
        return `/admin/jobs/${id}/applications?${p.toString()}`;
      },
      transformResponse: (r: ApiResponse<ApplicantsListResponse>) => r.data,
    }),
    setJobStatus: builder.mutation<JobRow, { id: string; status: JobStatus; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/admin/jobs/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      transformResponse: (r: ApiResponse<JobRow>) => r.data,
      invalidatesTags: ['Community'],
    }),
    deleteJob: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/jobs/${id}`,
        method: 'DELETE',
        body: { reason },
      }),
      transformResponse: (r: ApiResponse<{ id: string }>) => r.data,
      invalidatesTags: ['Community'],
    }),
  }),
});

export const {
  useListJobsQuery,
  useGetJobStatsQuery,
  useGetJobDetailQuery,
  useGetJobApplicationsQuery,
  useSetJobStatusMutation,
  useDeleteJobMutation,
} = jobsApi;
