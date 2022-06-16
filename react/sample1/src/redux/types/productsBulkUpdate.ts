export enum ProductsBulkUpdateActions {
  SET_PRODUCTS = 'productsBulkUpdate/setProducts',
  SET_LABELS = 'productsBulkUpdate/setLabels',
  SET_BASICCHANNELS = 'productsBulkUpdate/setBasicChannels',
  SET_ATTRIBUTES = 'productsBulkUpdate/setAttributes',
  SET_ATTRIBUTEFILTERING = 'productsBulkUpdate/setAttributeFiltering',
  SET_ATTRIBUTESCHANNELS = 'productsBulkUpdate/setAttributesChannels',
  SET_INVENTORYDATA = 'productsBulkUpdate/setInventoryData',
  SET_CHANNELINVDCS = 'productsBulkUpdate/setChannelInvDcs',
  SET_CHANNELINV = 'productsBulkUpdate/setChannelInv',
  SET_LOADING = 'productsBulkUpdate/setLoading',
  SET_ISFORMUPDATED = 'productsBulkUpdate/setIsFormUpdated',
  SET_BOOLS = 'productsBulkUpdate/setBools',
}

interface SetProducts {
  type: typeof ProductsBulkUpdateActions.SET_PRODUCTS,
  value: Array<Entities.ProductProfile>,
}

interface SetLabels {
  type: typeof ProductsBulkUpdateActions.SET_LABELS,
  value: Array<Entities.ILabel>,
}

interface SetBasicChannels {
  type: typeof ProductsBulkUpdateActions.SET_BASICCHANNELS,
  value: Array<object>,
}

interface SetAttributes {
  type: typeof ProductsBulkUpdateActions.SET_ATTRIBUTES,
  value: {
    attributes: Array<Entities.ProductAttribute>,
    groups1: Array<string>,
    groups2: Array<string>
  },
}

interface SetAttributesChannels {
  type: typeof ProductsBulkUpdateActions.SET_ATTRIBUTESCHANNELS,
  value: Array<Entities.AttributesChannels>,
}

interface SetAttributeFiltering {
  type: typeof ProductsBulkUpdateActions.SET_ATTRIBUTEFILTERING,
  value: Array<Entities.ProductAttribute>,
}

interface SetInventoryData {
  type: typeof ProductsBulkUpdateActions.SET_INVENTORYDATA,
  value: Array<Entities.Inventory>,
}

interface SetChannelInvDcs {
  type: typeof ProductsBulkUpdateActions.SET_CHANNELINVDCS,
  value: Array<object>,
}

interface SetChannelInv {
  type: typeof ProductsBulkUpdateActions.SET_CHANNELINV,
  value: Array<object>,
}

interface SetLoading {
  type: typeof ProductsBulkUpdateActions.SET_LOADING,
  value: boolean,
}

interface SetIsFormUpdated {
  type: typeof ProductsBulkUpdateActions.SET_ISFORMUPDATED,
  value: boolean,
}

export type BooleanMap = { [key: string]: boolean };

interface SetBools {
  type: typeof ProductsBulkUpdateActions.SET_BOOLS,
  value: BooleanMap,
}


export type ProductsBulkUpdateActionTypes =
  SetProducts
  | SetLabels
  | SetBools
  | SetIsFormUpdated
  | SetAttributeFiltering
  | SetLoading
  | SetChannelInv
  | SetChannelInvDcs
  | SetInventoryData
  | SetAttributesChannels
  | SetAttributes
  | SetBasicChannels;
