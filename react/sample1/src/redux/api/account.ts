import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

export const accountApi = createApi({
  reducerPath: 'api.accounts',
  baseQuery: appBaseQuery({ baseUrl: '/v1/account' }),
  endpoints: (build) => ({
    getChannels: build.query<Entities.ChannelAccountObj[], void>({
      query: () => ({ url: '/channels', method: 'get' }),
    }),
    getPlatforms: build.query<Entities.Platform[], void>({
      query: () => ({ url: '/channelProfile', method: 'get' }),
    }),
  }),
});

export const { useGetPlatformsQuery, useGetChannelsQuery } = accountApi;
