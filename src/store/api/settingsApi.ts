import { baseApi, type ApiResponse } from './baseApi';

export interface SettingsContent {
  id: string | null;
  content: string;
  updated_at: string | null;
  created_at: string | null;
}

export interface AllSettings {
  terms: SettingsContent;
  privacy: SettingsContent;
  about: SettingsContent;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSettings: builder.query<AllSettings, void>({
      query: () => '/admin/settings',
      transformResponse: (r: ApiResponse<AllSettings>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),

    getTerms: builder.query<SettingsContent, void>({
      query: () => '/admin/settings/terms',
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),
    setTerms: builder.mutation<SettingsContent, { content: string }>({
      query: (body) => ({ url: '/admin/settings/terms', method: 'PUT', body }),
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      invalidatesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),

    getPrivacy: builder.query<SettingsContent, void>({
      query: () => '/admin/settings/privacy',
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),
    setPrivacy: builder.mutation<SettingsContent, { content: string }>({
      query: (body) => ({ url: '/admin/settings/privacy', method: 'PUT', body }),
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      invalidatesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),

    getAbout: builder.query<SettingsContent, void>({
      query: () => '/admin/settings/about',
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      providesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),
    setAbout: builder.mutation<SettingsContent, { content: string }>({
      query: (body) => ({ url: '/admin/settings/about', method: 'PUT', body }),
      transformResponse: (r: ApiResponse<SettingsContent>) => r.data,
      invalidatesTags: [{ type: 'Auth' as const, id: 'settings' }],
    }),
  }),
});

export const {
  useGetAllSettingsQuery,
  useGetTermsQuery,
  useSetTermsMutation,
  useGetPrivacyQuery,
  useSetPrivacyMutation,
  useGetAboutQuery,
  useSetAboutMutation,
} = settingsApi;
