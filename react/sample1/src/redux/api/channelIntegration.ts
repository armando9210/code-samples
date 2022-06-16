import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { v4 as uuidv4 } from 'uuid';
import { appBaseQuery } from '../../services/query';

export interface ChannelAccountEntry {
  /**
   * Value generated locally.
   * Backend does not generate unique ID's for these items.
   */
  id: string;
  channelAccountNum: number;
  /**
   * BE spelling error.
   */
  channnelAccountName: string;
  mappingType: number;
  productMappingNum: number;
}

export interface ChannelEntry {
  channelNum: number;
  channelName: string;
  channelAccountList: ChannelAccountEntry[];
}

export interface ExportListResponse {
  channelList: ChannelEntry[];
}

export const channelIntegrationApi = createApi({
  reducerPath: 'api.channelIntegration',
  baseQuery: appBaseQuery({ baseUrl: '/v1/channelIntegration' }),
  endpoints: build => ({
    getExportList: build.query<ExportListResponse, void>({
      query: () => ({ url: '/exportList', method: 'GET' }),
      transformResponse: (res: ExportListResponse) => {
        res.channelList = res.channelList.map(channel => {
          const items = channel.channelAccountList.map(a => ({ ...a, id: uuidv4() }));

          return {
            ...channel,
            channelAccountList: items,
          };
        });
        return res;
      },
      keepUnusedDataFor: 60 * 5, // Keep data for 5 minutes
    }),
    getAvailableMappings: build.query<Entities.MappingContentProfile[], void>({
      query: () => ({ url: '/availableMappingContent', method: 'GET' }),
      transformResponse: (res: Entities.MappingContentProfile[]) => res.sort((a, b) => {
        if (a.MappingTypeNum !== b.MappingTypeNum) {
          return a.MappingTypeNum - b.MappingTypeNum;
        }

        return a.Name.localeCompare(b.Name);
      }),
      keepUnusedDataFor: 60 * 5, // Cache values for 5 minutes
    }),
  }),
});

export const { useGetExportListQuery, useGetAvailableMappingsQuery } = channelIntegrationApi;
