import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { v4 as uuidv4 } from 'uuid';
import { appBaseQuery } from '../../services/query';
import { OrderStatus } from '../../types/enums';
import { objArrayToCommaString } from '../../util/objects';

export interface ListOrdersParams extends api.Pagination {
  orderDateFrom?: string;
  orderDateTo?: string;
  channelNum?: string;
  channelName?: string;
  centralOrderNum?: string;
  channelOrderID?: string;
  secondaryChannelOrderId?: string;
  buyerEmail?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingZipCode?: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  orderStatus?: OrderStatus[];
  trackingNumber?: string[];
  endCustomerPoNum?: string[];
  channelItemID?: number[];
  sku?: string[];
}

interface SKUTopInfoResponse {
  orderTopSkuInfos: Entities.SimpleOrderSKUInfo[];
}

interface SKUTopInfoParams {
  startDate?: string;
  endDate?: string;
  channelName?: string;
}

export const ordersApi = createApi({
  reducerPath: 'api.orders',
  baseQuery: appBaseQuery({ baseUrl: '/v1/orders' }),
  endpoints: build => ({
    listOrders: build.query<{ count: number, orders: Entities.SimpleOrder[] }, ListOrdersParams | void>({
      query: (params?: ListOrdersParams) => {
        const normalizedParams = objArrayToCommaString(params);
        const queryParams: any = {
          $count: true,
          $top: 10,
          $skip: 0,
          ...normalizedParams,
        };

        return { url: '/', method: 'get', params: queryParams };
      },
      transformResponse: ({ count, orders }: { count: number, orders: Entities.SimpleOrder[] }) => ({
        count,
        orders: orders.map(o => ({ ...o, uid: uuidv4() })),
      }),
    }),
    getSKUTopInfo: build.query<SKUTopInfoResponse, SKUTopInfoParams>({
      query: (params) => ({
        url: '/Summary/SkuTopInfo',
        method: 'get',
        params,
      }),
    }),
  }),
});

export const { useListOrdersQuery, useGetSKUTopInfoQuery } = ordersApi;
