import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';
import { OrderStatus } from '../../types/enums';
import { objArrayToCommaString } from '../../util/objects';

export interface ListShipmentsParams extends api.Pagination {
  channelNum?: number;
  channelName?: string;
  channelOrderID?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  mustShipDateFrom?: string;
  mustShipDateTo?: string;
  shipDateFrom?: string;
  shipDateTo?: string;
  shippingStatus?: OrderStatus[];
  trackingNumber?: string[];
  channelItemID?: number[];
  sku?: string[];
}

export const shipmentsApi = createApi({
  reducerPath: 'api.shipments',
  baseQuery: appBaseQuery({ baseUrl: '/v1/shipments' }),
  endpoints: build => ({
    listShipments: build.query<{ count: number, shipments: Entities.SimpleShipment[] }, ListShipmentsParams | void>({
      query: (params?: ListShipmentsParams) => {
        const normalizedParams = objArrayToCommaString(params);
        const queryParams: any = {
          $count: true,
          $top: 10,
          $skip: 0,
          ...normalizedParams,
        };

        return { url: '/', method: 'get', params: queryParams };
      },
    }),
  }),
});

export const { useListShipmentsQuery } = shipmentsApi;
