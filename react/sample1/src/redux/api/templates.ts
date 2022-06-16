import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

interface UploadMappingTemplateParams {
  mappingType: number;
  data: FormData;
  channelNum: number;
  templateName?: string;
}

export const templatesApi = createApi({
  reducerPath: 'api.app',
  baseQuery: appBaseQuery({ baseUrl: '/v1/channels' }),
  endpoints: build => ({
    uploadMappingTemplate: build.mutation<void, UploadMappingTemplateParams>({
      query: ({ data, ...params }: UploadMappingTemplateParams) => ({
        url: params.mappingType === 8 ? '/templateMapping/copywriting/upload': '/templateMapping/upload',
        method: 'POST',
        data,
        params,
      }),
    }),
  }),
});

export const { useUploadMappingTemplateMutation } = templatesApi;
