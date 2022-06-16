import { v4 as uuidv4 } from 'uuid';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

interface ListChannelAccountsParams {
  channelNum?: number;
}

interface MappedChannelAccountsResponse {
  [key: string]: {
    channelName: string;
    accounts: Entities.ProfileChannelAccount[],
  }
}

export type ChannelAccount = Entities.ProfileChannelAccount & {
  $uid: string;
  displayAnalyzeData?: boolean,
  platform?: Entities.ChannelProfile;
};

export type AccountMap = {
  /**
   * Retail accounts grouped by PlatformNum
   */
  retail: { [key: string]: ChannelAccount[] },
  /**
   * Non-retail accounts grouped by ChannelNum
   */
  nonRetail: { [key: string]: ChannelAccount[] },
};

export const channelsApi = createApi({
  reducerPath: 'api.channels',
  baseQuery: appBaseQuery({ baseUrl: '/v1/channels' }),
  endpoints: build => ({
    listChannels: build.query<Entities.ChannelProfile[], { retailer: boolean } | void>({
      query: (params) => ({ url: '/accountEnabled', method: 'GET', params }),
    }),
    listChannelAccounts: build.query<Entities.ProfileChannelAccount[], ListChannelAccountsParams | void>({
      query: (params) => ({ url: '/profileChannelAccounts/', method: 'GET', params }),
      keepUnusedDataFor: 10,
    }),
    listGroupedChannelAccounts: build.query<MappedChannelAccountsResponse, ListChannelAccountsParams | void>({
      query: (params) => ({ url: '/profileChannelAccounts/', method: 'GET', params }),
      transformResponse: (data: Entities.ProfileChannelAccount[]) => {
        const map: MappedChannelAccountsResponse = {};

        data.forEach(account => {
          const channelNum = account.ChannelNum.toString();

          if (!map[channelNum]) {
            map[channelNum] = {
              channelName: account.ChannelName,
              accounts: [],
            };
          }

          map[channelNum].accounts.push(account);
        });

        return map;
      },
    }),
    listAccountEnabledChannels: build.query<Entities.ChannelProfile[], void>({
      query: () => ({ url: '/accountEnabled', method: 'GET' }),
      keepUnusedDataFor: 60 * 10, // 10 minutes caching
    }),
    listMappedAccounts: build.query<AccountMap, void>({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        try {
          const [{ data: accounts = [] }, { data: platforms = [] }] = await Promise.all([
            baseQuery({ url: '/profileChannelAccounts', method: 'GET' }),
            baseQuery({ url: '/forImport', method: 'GET' }),
          ]);
          const platformsMap: { [key: string]: Entities.ChannelProfile } = {};
          const mappedAccounts: AccountMap = {
            retail: {},
            nonRetail: {},
          };

          // Generate channels map for easier access.
          (platforms as Entities.ChannelProfile[]).forEach(c => {
            platformsMap[c.channelNum.toString()] = c;
          });

          (accounts as Entities.ProfileChannelAccount[]).forEach(a => {
            const account: ChannelAccount = {
              ...a,
              $uid: uuidv4(),
            };
            const channelNumStr = a.ChannelNum.toString();
            const platformNumStr = a.PlatformNum.toString();

            if (platformNumStr === '0') {
              if (!mappedAccounts.nonRetail[channelNumStr]) {
                mappedAccounts.nonRetail[channelNumStr] = [];
              }

              mappedAccounts.nonRetail[channelNumStr].push({
                ...account,
                displayAnalyzeData: platformsMap[channelNumStr].displayAnalyzeData,
              });
              return;
            }

            const entry = {
              ...account,
              displayAnalyzeData: platformsMap[channelNumStr].displayAnalyzeData,
              platform: platformsMap[platformNumStr],
            };

            if (!mappedAccounts.retail[platformNumStr]) {
              mappedAccounts.retail[platformNumStr] = [];
            }

            mappedAccounts.retail[platformNumStr].push(entry);
          });

          return { data: mappedAccounts };
        } catch (e) {
          return { error: 'Could not retrieve all the required information, please try again later' };
        }
      },
    }),
  }),
});

export const {
  useListChannelsQuery,
  useListChannelAccountsQuery,
  useListGroupedChannelAccountsQuery,
  useListAccountEnabledChannelsQuery,
  useListMappedAccountsQuery,
} = channelsApi;
