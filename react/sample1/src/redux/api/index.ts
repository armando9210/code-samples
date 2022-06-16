import { accountApi } from './account';
import { channelApi } from './channel';
import { channelIntegrationApi } from './channelIntegration';
import { channelsApi } from './channels';
import { exportsApi } from './exports';
import { optApi } from './opt';
import { ordersApi } from './orders';
import { productElementsApi } from './productElements';
import { userManagementApi } from './userManagement';
import { productsApi } from './products';
import { shipmentsApi } from './shipments';
import { shippingProductApi } from './shippingProducts';
import { channelAccountApi } from './channelAccount';
import { filesApi } from './files';
import { importsApi } from './imports';

export const apiReducers = {
  [optApi.reducerPath]: optApi.reducer,
  [productElementsApi.reducerPath]: productElementsApi.reducer,
  [userManagementApi.reducerPath]: userManagementApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [exportsApi.reducerPath]: exportsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [channelsApi.reducerPath]: channelsApi.reducer,
  [shippingProductApi.reducerPath]: shippingProductApi.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
  [shipmentsApi.reducerPath]: shipmentsApi.reducer,
  [channelIntegrationApi.reducerPath]: channelIntegrationApi.reducer,
  [channelAccountApi.reducerPath]: channelAccountApi.reducer,
  [filesApi.reducerPath]: filesApi.reducer,
  [importsApi.reducerPath]: importsApi.reducer,
};

export const apiMiddlewares = [
  optApi.middleware,
  productElementsApi.middleware,
  userManagementApi.middleware,
  accountApi.middleware,
  productsApi.middleware,
  exportsApi.middleware,
  shippingProductApi.middleware,
  ordersApi.middleware,
  channelsApi.middleware,
  channelApi.middleware,
  shipmentsApi.middleware,
  channelIntegrationApi.middleware,
  channelAccountApi.middleware,
  filesApi.middleware,
  importsApi.middleware,
];
