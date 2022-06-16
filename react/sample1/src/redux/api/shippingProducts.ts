import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { erpBaseQuery } from '../../services/query';

interface GetShippingProductsResponse {
  data: {
    inventoryListCount: number;
    inventoryList: Entities.ShippingProducts[];
  }
}

interface MappedGetShippingProductsResponse {
  count: number;
  products: Entities.ShippingProducts[];
}

export interface GetShippingProductsParams extends api.Pagination {
  $filter?: object;
}

export const shippingProductApi = createApi({
  reducerPath: 'api.shippingProduct',
  baseQuery: erpBaseQuery({ baseUrl: '/productExts' }),
  endpoints: (build) => ({
    getShippingProducts: build.query<MappedGetShippingProductsResponse, GetShippingProductsParams | void>({
      query: (params) => {
        const requestParams: GetShippingProductsParams = {
          $count: true,
          ...params,
        };
        return { url: '/find', method: 'post', data: requestParams };
      },
      transformResponse: (response: GetShippingProductsResponse) => ({
        count: response.data.inventoryListCount,
        products: response.data.inventoryList,
      }),
    }),
  }),
});

export const { useGetShippingProductsQuery } = shippingProductApi;
