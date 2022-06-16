import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { ProductsReportType } from '../../services/products';
import { appBaseQuery } from '../../services/query';
import { ProductType } from '../../types/enums';


/**
 * API response.
 *
 * The attributes are optional because the API returns an empty object
 * if there's no data available (instead of yielding the proper schema with 0/empty array values)
 */
interface ListProductsByTypeAPIResponse {
  ProductTotalCount?: number;
  ProductList?: Entities.ProductProfile[];
}

interface ListProductsByTypeResponse {
  ProductTotalCount: number;
  ProductList: Entities.ProductProfile[];
}

interface GetChannelAccountProductsAPIResponse {
  ProductTotalCount?: number;
  ProductList?: Entities.ProductChannelAccount[];
}

interface GetChannelAccountProductsResponse {
  ProductTotalCount: number;
  ProductList: Entities.ProductChannelAccount[];
}

interface ListProductsByTypeAPIParams {
  ReportType?: ProductsReportType;
  ProductType?: ProductType;
  ReportTypeApplicationType?: number;
  FilterConditionList?: any[];
}

interface GetChannelAccountProductsAPIParams {
  channelNum: number;
  channelAccountNum: number;
}

interface StyleMasterGroupNamesParams {
  channelNum?: number;
}

export const productsApi = createApi({
  reducerPath: 'api.products',
  baseQuery: appBaseQuery({ baseUrl: '/v1/products' }),
  endpoints: (build) => ({
    listProductsByType: build.query<ListProductsByTypeResponse, ListProductsByTypeAPIParams | void>({
      query: (params) => {
        const requestParams = {
          ReportType: ProductsReportType.ALL,
          ProductType: ProductType.ALL,
          ReportTypeApplicationType: 0,
          FilterConditionList: [],
          ...params,
        };
        return ({ url: '/ListByType', method: 'POST', data: requestParams });
      },
      transformResponse: (response: ListProductsByTypeAPIResponse): ListProductsByTypeResponse => ({
        ProductTotalCount: 0,
        ProductList: [],
        ...response,
      }),
    }),
    simpleProducts: build.query<ListProductsByTypeResponse, {} | void>({
      query: () => ({ url: '/GetSimpleProducts', method: 'GET' }),
      transformResponse: (response: ListProductsByTypeAPIResponse): ListProductsByTypeResponse => ({
        ProductTotalCount: 0,
        ProductList: [],
        ...response,
      }),
    }),
    getChannelAccountProducts: build.query<GetChannelAccountProductsResponse, GetChannelAccountProductsAPIParams>({
      query: (params) => ({ url: `/GetChannelAccountProducts?channelNum=${params.channelNum}&channelAccountNum=${params.channelAccountNum}`, method: 'GET' }),
      transformResponse: (response: GetChannelAccountProductsAPIResponse): GetChannelAccountProductsResponse => ({
        ProductTotalCount: 0,
        ProductList: [],
        ...response,
      }),
    }),
    styleMasterGroupNames: build.query<string[], StyleMasterGroupNamesParams>({
      query: (params) => {
        const url = params.channelNum ? `/getStyleMasterGroupName?channelNum=${params.channelNum}` : '/getStyleMasterGroupName';
        return ({ url, method: 'GET' });
      },
    }),
  }),
});

export const { useListProductsByTypeQuery, useSimpleProductsQuery, useGetChannelAccountProductsQuery, useStyleMasterGroupNamesQuery } = productsApi;
