import { BooleanMap, ProductsBulkUpdateActions, ProductsBulkUpdateActionTypes } from '../types/productsBulkUpdate';


interface ProductsBulkUpdateState {
  products: Array<Entities.ProductProfile>;
  labels: Array<Entities.ILabel>;
  basicChannels: Array<object>;
  groups1: Array<string>;
  isFormUpdated: boolean;
  booleanMap: BooleanMap;
  groups2: Array<string>;
  loading: boolean;
  channelInvDcs: Array<object>;
  channelInv: Array<object>;
  inventoryData: Array<Entities.Inventory>;
  attributes: Array<Entities.ProductAttribute>;
  originalAttributes: Array<Entities.ProductAttribute>;
  attributesChannels: Array<Entities.AttributesChannels>;
}

const initialState: ProductsBulkUpdateState = {
  products: [],
  labels: [],
  basicChannels: [],
  channelInvDcs: [],
  loading: false,
  booleanMap: {},
  isFormUpdated : false,
  channelInv: [],
  attributes: [],
  inventoryData: [],
  originalAttributes: [],
  groups1: [],
  groups2: [],
  attributesChannels: [],
};

const profiles = (state = initialState, action: ProductsBulkUpdateActionTypes) => {
  switch (action.type) {
    case ProductsBulkUpdateActions.SET_BOOLS:
      return { ...state, booleanMap: action.value };
    case ProductsBulkUpdateActions.SET_ISFORMUPDATED:
      return { ...state, isFormUpdated: action.value };
    case ProductsBulkUpdateActions.SET_LOADING:
      return { ...state, loading: action.value };
    case ProductsBulkUpdateActions.SET_CHANNELINV:
      return { ...state, channelInv: action.value };
    case ProductsBulkUpdateActions.SET_CHANNELINVDCS:
      return { ...state, channelInvDcs: action.value };
    case ProductsBulkUpdateActions.SET_INVENTORYDATA:
      return { ...state, inventoryData: action.value };
    case ProductsBulkUpdateActions.SET_ATTRIBUTEFILTERING:
      return { ...state, attributes: action.value };
    case ProductsBulkUpdateActions.SET_PRODUCTS:
      return { ...state, products: action.value };
    case ProductsBulkUpdateActions.SET_LABELS:
      return { ...state, labels: action.value };
    case ProductsBulkUpdateActions.SET_BASICCHANNELS:
      return { ...state, basicChannels: action.value };
    case ProductsBulkUpdateActions.SET_ATTRIBUTES:
      return { ...state, attributes: action.value.attributes, originalAttributes: action.value.attributes,  groups1: action.value.groups1, groups2: action.value.groups2 };
    case ProductsBulkUpdateActions.SET_ATTRIBUTESCHANNELS:
      return { ...state, attributesChannels: action.value };

    default:
      return state;
  }
};

export default profiles;
