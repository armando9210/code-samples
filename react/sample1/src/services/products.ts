import { ProductType } from '../types/enums';
import { api, simpleApi, erpAPI } from './http';
import {api} from "../../../../../api/src/services/http";

export enum ProductsReportType {
  ALL = 10001,
  PRODUCT_BASIC,
  CHANNELS = 2001,
  LABELS = 3001,
  ATTRIBUTES = 4001,
  DISTRIBUTION_CENTERS = 5001,
  MEDIA_PLACEMENTS = 6001,
  BUNDLE_COMPONENTS = 7001,
  CATEGORIES = 8001,
  CLASSIFICATION = 9001,
}
export default class Products {
  static async fetchSingleProductById(idProduct: any): Promise<Entities.ProductData> {
    return api.get(`/v1/productsV2/${idProduct}`);
  }

  static async getAttribute(attributeNum: any): Promise<any> {
    return api.get(`/v1/productsElements/attributes/${attributeNum}`);
  }

  static async getClassifications(): Promise<any> {
    return api.get('/v1/productsElements/classifications');
  }


  static async createLabel(params: any): Promise<any> {
    return api.post('/v1/productsElements/labels', {
      ...params,
    });
  }

  static async getLabels(params: any): Promise<any> {
    return api.get('/v1/productsElements/labels', {
      params,
    });
  }

  static async getChannels(): Promise<any> {
    return api.get('/v1/channels');
  }

  static async getAccountEnabled(): Promise<any> {
    return api.get('/v1/channels/accountEnabled');
  }

  static async getMediaPlacements(): Promise<Array<Entities.MediaPlacement>> {
    return api.get('/v1/productsElements/mediaPlacements');
  }

  static async getDistributionCenters(): Promise<Array<Entities.DistributionCenter>> {
    return api.get('/v1/distributionCenters');
  }

  static async getAllAttributes(): Promise<Array<Entities.ProductAttribute>> {
    return api.get('/v1/productsElements/attribute/all');
  }

  static async getAttributes(): Promise<Array<Entities.ProductAttribute>> {
    return api.get('/v1/productsElements/attributes');
  }

  static async getAttributeOptions(): Promise<Array<StringKAnyVPair>> {
    return api.get('/v1/products/attributeOption/lazyLoading');
  }

  static async getBasicAttrs(): Promise<any> {
    return api.get('/v1/productsElements/productBasicInfoAttribute');
  }

  static async getChannelControlFlags(): Promise<Array<any>> {
    return api.get('/v1/productsElements/channelControlFlags');
  }

  static async createAttribute(params: any): Promise<any> {
    return api.post('/v1/productsElements/attributes', {
      ...params,
    });
  }

  static async editAttribute(params: any, attributeNum: number): Promise<any> {
    return api.patch(`/v1/productsElements/attributes/${attributeNum}`, {
      ...params,
    });
  }

  static async deleteAttribute(attributeNum: number): Promise<any> {
    return api.delete(`/v1/productsElements/attributes/${attributeNum}`);
  }

  static async editProduct(params: any, productId: number): Promise<any> {
  // static async editProduct(params: any, productId: string): Promise<any> {
    return api.patch(`/v1/productsV2/${productId}`, {
      ...params,
    });
  }

  static async createProduct(params: any): Promise<any> {
    return api.post('/v1/productsV2', {
      ...params,
    });
  }

  // static async createStyleMaster(params: Entities.StyleMasterPayload): Promise<Entities.StyleMasterPayload> {
  static async createStyleMaster(params: StringKAnyVPair): Promise<Entities.StyleMasterPayload> {
    return api.post('/v1/products/stylemaster', {
      ...params,
    });
  }

  static async createStyleMaster2(params: StringKAnyVPair): Promise<any> {
    return api.post('/v1/products/simpleStyleMaster', {
      ...params,
    });
  }

  // static async editStyleMaster(params: Entities.StyleMasterPayload, productId: string): Promise<Entities.StyleMasterPayload> {
  static async editStyleMaster(params: StringKAnyVPair, productId: string): Promise<Entities.StyleMasterPayload> {
    return api.patch(`/v1/products/stylemaster/${productId}`, {
      ...params,
    });
  }

  static async getStyleMaster(productId: string): Promise<Entities.StyleMasterPayload> {
    return api.get(`/v1/products/stylemaster/${productId}`);
  }

  static async getStyleMaster2(productId: string): Promise<any> {
    return api.get(`/v1/products/simpleStyleMaster/${productId}`);
  }

  static async deleteStyleMaster(productId: string): Promise<any> {
    return api.delete(`/v1/products/stylemaster/${productId}`);
  }

  static async getProductsByAttributes(params: any): Promise<any> {
    return api.get('/v1/ProductsListingByAttribute', {
      params,
    });
  }

  static async getProductExts(sku: string): Promise<Entities.ProductExts> {
    return erpAPI.get(`/productExts/${sku}`);
  }

  static async createProductExts(params: object): Promise<Entities.ProductExts> {
    const { data: { success, messages, inventory } } = await erpAPI.post('/productExts', {
      ...params,
    });
    if (!success) {
      throw (messages[0].message);
    } else {
      return inventory;
    }
  }

  static async saveProductExts(params: object): Promise<Entities.ProductExts> {
    const { data: { success, messages, inventory } } = await erpAPI.patch('/productExts', params);
    if (!success) {
      throw (messages[0].message);
    } else {
      return {
        data: {
          inventory,
        },
      };
    }
  }

  static async fetchProductAssignedChannelInv(productId: string): Promise<Entities.ProductsAssignedChannelInv> {
    return api.get(`v1/getProductAssignedInvChanneAndDistProfile/${productId}`);
  }

  static async fetchProductAttributes(productId: string): Promise<StringKAnyVPair[]> {
    return api.get(`v1/product/${productId}/attributes`);
  }

  static async saveProductAttributes(productId: string, attributes: StringKAnyVPair[]): Promise<any> {
    return api.patch(`v1/product/${productId}/attributes`, attributes);
  }

  static async fetchStyleVariations(): Promise<any> {
    return erpAPI.get('dataEntryCode/styleVariation', {
      headers: {
        backdoorModeEmail: 'test@api.com',
        backdoorModePassword: 'blabla',
      },
    });
  }

  static async createProductAssignedChannelInv(params: object, productId: string): Promise<Entities.ProductsAssignedChannelInv | { title: string }> {
    const res: any = await api.post(`v1/upsertProductAssignedInv/${productId}`, {
      ...params,
    });
    if (res && typeof res === 'object') {
      const { channelList, title } = res;

      if (!channelList) {
        throw (title);
      } else {
        return channelList;
      }
    } else {
      // eslint-disable-next-line
      throw {title: `error: ${res}`};
    }
  }

  static async editProductImages(
    productId: string,
    imgs: StringKAnyVPair[],
  ) {
    return simpleApi.patch(`/v1/product/${productId}/images`, imgs);
  }

  static async getProductImages(productId: string) {
    return api.get(`/v1/product/${productId}/images`);
  }
}

export const deleteProductAlias = async (productAliasNum: number): Promise<any> => api.post(`/v1/product/alias/${productAliasNum}/delete`);

export const fetchProductAlias = async (productId: string): Promise<any> => api.get(`/v1/product/${productId}/alias`);

export const createProductAlias = async (productId: string, json:string): Promise<any> => api.post(`/v1/product/${productId}/alias`, json);

export const patchProductImage = async (productId: string, json:string): Promise<any> => api.patch(`/v1/product/${productId}/images`, json);

export const fetchProductAttributeSets = async (params: any): Promise<any> => api.get('/v1/attributeSet', {
  params,
});

export const addProductAttributeSet = async (params: any): Promise<any> => api.post('/v1/attributeSet', {
  ...params,
});

export const editProductAttributeSet = async (params: any, id: number): Promise<any> => api.patch(`/v1/attributeSet/${id}`, {
  ...params,
});

export const deleteProductAttributeSet = async (id: string): Promise<any> => api.post(`/v1/attributeSet/${id}/delete`);

export const fetchAvailableAttributes = async (): Promise<any> => api.get('/v1/attributeSet/availableAttributes');

export const fetchAttributesByAttributeSet = async (rowNum: number): Promise<any> => api.get(`/v1/attributeSet/${rowNum}/items`);

export const saveAttributeSet = async (rowNum: number, json: string): Promise<any> => api.post(`/v1/attributeSet/${rowNum}/assign`, json);
