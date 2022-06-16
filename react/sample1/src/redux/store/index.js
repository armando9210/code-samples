import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import MapTransform from '../transformers';
import { ProfilesAction } from '../types/profiles';
import { apiMiddlewares } from '../api';

const persistConfig = {
  key: 'root',
  storage,
  //whitelist: ['profiles', 'routes', 'orders', 'salesOrders'],
  whitelist: ['routes', 'orders', 'salesOrders'],
  transforms: [MapTransform],
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));
/* eslint-disable no-underscore-dangle */
const store = configureStore(
  {
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'message',
          'notifications.message',
          'profiles.permissions',
          'orders.shippingForm',
          'orders.billingForm',
          'orders.shippingForm',
          'orders.pendingForm',
          'orders.shippingViewForm',
          'salesOrders.shippingForm',
          'salesOrders.billingForm',
          'salesOrders.detailsForm',
        ],
      },
    })
      .concat(apiMiddlewares),
  },
);
/* eslint-enable */

export const persistor = persistStore(store);

export default store;
export const getStore = () => store;
