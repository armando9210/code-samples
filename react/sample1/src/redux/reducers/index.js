import orders from './orders';
import profiles from './profiles';
import notifications from './notifications';
import routes from './routes';
import shipments from './shipments';
import exports from './exports';
import imports from './imports';
import sidebar from './sidebar';
import orderDetails from './orderDetails';
import salesOrderDetails from './salesOrderDetails';
import integrations from './integrations';
import productsBulkUpdate from './productsBulkUpdate';
import { apiReducers } from '../api';

const rootReducer = {
  productsBulkUpdate,
  ...apiReducers,
};

export default rootReducer;
