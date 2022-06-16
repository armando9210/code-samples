import { BooleanMap, ProductsBulkUpdateActions, ProductsBulkUpdateActionTypes } from '../types/productsBulkUpdate';

const setProducts = (value: Array<Entities.ProductProfile>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_PRODUCTS,
  value,
});

const setLabels = (value: Array<Entities.ILabel>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_LABELS,
  value,
});

const setBasicChannels = (value: Array<object>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_BASICCHANNELS,
  value,
});

const setAttributes = ({ attributes, groups1, groups2 } : { attributes: Array<Entities.ProductAttribute>, groups1: Array<string>, groups2: Array<string> }) => ({
  type: ProductsBulkUpdateActions.SET_ATTRIBUTES,
  value: {
    attributes,
    groups1,
    groups2,
  },
});

const setAttributesChannels = (value: Array<Entities.AttributesChannels>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_ATTRIBUTESCHANNELS,
  value,
});

const setAttributeFiltering = (value: Array<Entities.ProductAttribute>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_ATTRIBUTEFILTERING,
  value,
});

const setInventoryData = (value: Array<Entities.Inventory>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_INVENTORYDATA,
  value,
});

const setChannelInvDcs = (value: Array<object>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_CHANNELINVDCS,
  value,
});

const setChannelInv = (value: Array<object>): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_CHANNELINV,
  value,
});

const setLoading = (value: boolean): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_LOADING,
  value,
});

const setIsFormUpdated = (value: boolean): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_ISFORMUPDATED,
  value,
});

const setBools = (value: BooleanMap): ProductsBulkUpdateActionTypes => ({
  type: ProductsBulkUpdateActions.SET_BOOLS,
  value,
});

const actions = {
  setProducts,
  setLabels,
  setIsFormUpdated,
  setBools,
  setChannelInv,
  setLoading,
  setInventoryData,
  setChannelInvDcs,
  setAttributeFiltering,
  setAttributes,
  setAttributesChannels,
  setBasicChannels,
};

export default actions;
