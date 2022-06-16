import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from "../../services/query";

export interface ListImportFilesParams extends api.Pagination {
  requestedDateFrom?: string;
  requestedDateTo?: string;
  importType?: number;
  importStatus?: string;
  requester?: string;
  reason?: string;
}

export const importsApi = createApi({
  reducerPath: 'api.imports',
  baseQuery: appBaseQuery({ baseUrl: '/v1/imports' }),
  endpoints: (builder) => ({
    listImportFiles: builder.query<{ count: number, data: Entities.ImportFileProfile[] }, ListImportFilesParams | void>({
      query: (params) => ({ url: '/importfiles', method: 'get', params }),
      transformResponse: (res: { ImportFileTotalCount: number, ImportFileProfileList: Entities.ImportFileProfile[] }) => ({
        count: res.ImportFileTotalCount,
        data: res.ImportFileProfileList || [],
      }),
    }),
  }),
});

export const { useListImportFilesQuery } = importsApi;
