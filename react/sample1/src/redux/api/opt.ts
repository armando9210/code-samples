import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { appBaseQuery } from '../../services/query';

export interface IEnquiredValuesPayload {
  ProductSearchLevel: number;
  IsForExportToFile: boolean;
  KEYSEARCHPROPERTYNAMELIST: string[];
  SEARCHATTRIBUTEIDLIST: string[];
}

export interface IEnquiredValuesResponse {
  [key: string]: string,
}

export const optApi = createApi({
  reducerPath: 'api.opt',
  baseQuery: appBaseQuery({ baseUrl: '/v1/opt/products' }),
  endpoints: (builder) => ({
    getOPTList: builder.query<{ TotalCount: number, OPTList: Entities.OPT[] }, api.Pagination | void>({
      query: (pagination) => ({ url: '/getOPTList', method: 'get', params: pagination }),
    }),
    getOPTAttributes: builder.query<Entities.CommerceCentralOPTAttribute[], void>({
      query: () => ({ url: '/getOPTAttributeList', method: 'get' }),
    }),
    addOPTProduct: builder.mutation<void, Entities.CommerceCentralOPTDetailProduct>({
      query: (data) => ({ url: '/addOPTProduct', method: 'post', data }),
    }),
    postGetEnquiredValues: builder.mutation<IEnquiredValuesResponse[], { payload: IEnquiredValuesPayload  }>({
      query: ({ payload }) =>
        ({
          url: '/getOPTEnquiredValue',
          method: 'POST',
          data: payload,
        })
      ,
    }),
  }),
});

export const { useGetOPTListQuery, useGetOPTAttributesQuery, useAddOPTProductMutation, usePostGetEnquiredValuesMutation } = optApi;
