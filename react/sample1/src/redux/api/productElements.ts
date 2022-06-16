import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

export interface AttributesMap {
  [key: string]: Entities.ProductAttribute;
}

export const productElementsApi = createApi({
  reducerPath: 'api.productElements',
  baseQuery: appBaseQuery({ baseUrl: '/v1/productsElements' }),
  endpoints: (build) => ({
    getClassifications: build.query<Entities.ProductClassification[], void>({
      query: () => ({ url: '/classifications', method: 'get' }),
    }),
    getAttributes: build.query<Entities.ProductAttribute[], void>({
      query: () => ({ url: '/attributes', method: 'get' }),
    }),
    /**
     * Return all the existing attributes on an object map.
     * This helps quick querying for existing attributes with a well-known name.
     */
    getAttributesMap: build.query<AttributesMap, void>({
      query: () => ({ url: '/attributes', method: 'get' }),
      transformResponse: (res: Entities.ProductAttribute[]) => {
        const map: AttributesMap = {};

        // BE treats attribute names as unique, regardless of the channel they're assigned (if any).
        res.forEach(attribute => {
          map[attribute.AttributeName] = attribute;
        });

        return map;
      },
      keepUnusedDataFor: 10 * 60, // 10 minutes cache
    }),
    getAttributesByChannelNum: build.query<Entities.ProductAttribute[], { channelNum?: number } | void>({
      query: ({ channelNum } = { channelNum: 0 }) => ({
        url: `/${channelNum}/channelAttributes`,
        method: 'GET',
      }),
    }),
    getAvailableChannelsForAttributes: build.query<any, { ChannelNum: number, ChannelName: string } | void>({
      query: () => ({
        url: '/attribute/availableChannels',
        method: 'GET',
      }),
    }),
    getCommonAttributesByChannel: build.query<any, { channelNum?: number } | void>({
      query: ({ channelNum } = { channelNum: 0 }) => ({
        url: `/${channelNum}/commonChannelAttributes`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetClassificationsQuery, useGetAttributesQuery, useGetAttributesMapQuery, useGetAttributesByChannelNumQuery, useGetAvailableChannelsForAttributesQuery, useGetCommonAttributesByChannelQuery } = productElementsApi;
