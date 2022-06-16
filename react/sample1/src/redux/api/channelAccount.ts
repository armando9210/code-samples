import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';
import { ChannelAccountTemplateMappingType } from '../../types/enums';

interface UploadMappingTemplateParams {
  mappingType: ChannelAccountTemplateMappingType;
  data: FormData;
  channelNum: string;
  channelAccountNum: string;
  templateName?: string;
}

export const channelAccountApi = createApi({
  reducerPath: 'api.app',
  baseQuery: appBaseQuery({ baseUrl: '/v1/channelAccount' }),
  endpoints: build => ({
    uploadMappingTemplate: build.mutation<void, UploadMappingTemplateParams>({
      query: ({ data, ...params }: UploadMappingTemplateParams) => ({
        url: '/mapping/upload',
        method: 'POST',
        data,
        params,
      }),
    }),
  }),
});

export const { useUploadMappingTemplateMutation } = channelAccountApi;
