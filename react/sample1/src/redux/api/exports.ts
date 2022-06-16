import { v4 as uuidv4 } from 'uuid';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';
import { ExportReportType, ExportStatus } from '../../types/enums';

interface GetExportFilesResponse {
  TotalExportFileCount: number;
  ExportFileList: Entities.ExportFile[];
}

interface MappedGetExportFilesResponse {
  count: number;
  data: Entities.ExportFile[];
}

export interface GetExportFilesParams extends api.Pagination {
  /**
   * Datetime string
   */
  requestedDateFrom?: string;
  /**
   * Datetime string
   */
  requestedDateTo?: string;
  exportReportType?: ExportReportType;
  exportStatus?: ExportStatus;
  requester?: string;
}

export interface ExportChannelAccountFileParams {
  // Query parameters
  fileOperation?: number;
  channelAcctJsonFileId?: string;
  // BodyParams
  channelNum: number;
  channelAccountNum: number;
  mappingType: number;
  reason: string;
  isForAllSku: boolean;
  centralProductNumList?: number[];
}

export const exportsApi = createApi({
  reducerPath: 'api.exports',
  baseQuery: appBaseQuery({ baseUrl: '/v1/exports' }),
  endpoints: (build) => ({
    getExportFiles: build.query<MappedGetExportFilesResponse, GetExportFilesParams | void>({
      query: (params) => {
        // API does not like empty filter params, so clear them before sending the request
        const filteredParams = Object.fromEntries(Object.entries(params as any).filter(([, v]) => v !== null && v !== undefined));

        const requestParams: GetExportFilesParams = {
          $count: true,
          ...filteredParams,
        };

        return { url: '/exportfiles', method: 'get', params: requestParams };
      },
      transformResponse: (response: GetExportFilesResponse) => {
        const count = response?.TotalExportFileCount || 0;
        const data = (response?.ExportFileList || []).map(file => ({ ...file, $uid: uuidv4() }));

        return { count, data };
      },
    }),
    exportChannelAccountFile: build.mutation<void, ExportChannelAccountFileParams>({
      query: ({ fileOperation, channelAcctJsonFileId, ...data }: ExportChannelAccountFileParams) => ({
        url: '/exportChannelAccountFile',
        method: 'POST',
        data,
        params: { fileOperation, channelAcctJsonFileId },
      }),
    }),
    exportProductsByType: build.mutation({
      query: () => ({
        url: '/exportproductfilesbytype',
        method: 'POST',
        data: {
          IsChannelSpecific: false,
          ReportType: 2001,
          ProductType: 0,
          ReportApplicationType: 1,
        },
      }),
    }),
  }),
});

export const { useGetExportFilesQuery, useExportChannelAccountFileMutation, useExportProductsByTypeMutation } = exportsApi;
