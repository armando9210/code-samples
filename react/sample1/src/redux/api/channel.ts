import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

export const channelApi = createApi({
  reducerPath: 'api.channel',
  baseQuery: appBaseQuery({ baseUrl: '/v1/channel' }),
  endpoints: build => ({
    getChannelProfileSettings: build.query<Entities.ChannelAccountProfileSetting, { channelAccountNum?: string } | void>({
      query: ({ channelAccountNum } = { channelAccountNum: '' }) => ({
        url: '/profileSettings',
        method: 'GET',
        headers: { channelAccountNum },
      }),
    }),
  }),
});

export const { useGetChannelProfileSettingsQuery } = channelApi;
