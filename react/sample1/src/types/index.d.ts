import { Moment } from 'moment';
import { ChannelAccountTemplateMappingType, ExportReportType, ExportStatus } from './enums';

declare global {
  declare namespace Entities {
    export interface ChannelControlFlag {
      ProductCHNLCtrlFlagId: string;
      ActionType?: number;
      CHNLCtrlFlag: string;
      CHNLCtrlFlagNum?: number;
      CHNLCtrlFlagDesc?: string;
      CHNLCtrlFlagType?: string;
      DatabaseNum?: number;
      MasterAccountNum?: number;
      ProfileNum?: number;
      CreatedBy?: string;
      UpdateBy?: string;
      CreatedOn?: string;
      LastUpdated?: string;
      ProductCount?: number;
    }

    export interface IPermission {
      EnterDate: string;
      LastUpdate: string;
      LevelCombination: number;
      MaxLevel: number;
      Notes: string;
      PermissionName: string;
      PermissionNum: number;
      Scope: string;
    }


    export interface ProductsAssignedChannelInv {
      channelList: Array<object>;
      distributionCenterList: Array<object>;
    }

    export interface OrderCarriers {
      totalCarrierCount: number;
      systemCarrierList: Array<object>;
    }

    export interface ChannelControlFlagObj {
      ProductCHNLCtrlFlagId: string;
      ActionType: number;
      CHNLCtrlFlag: string;
      CHNLCtrlFlagNum: number;
      CHNLCtrlFlagDesc: string;
      CHNLCtrlFlagType: string;
      DatabaseNum: number;
      MasterAccountNum: number;
      ProfileNum: number;
      CreatedBy: string;
      UpdateBy: string;
      CreatedOn: string;
      LastUpdated: string;
      ProductCount: number;
    }

    interface ShippedItems {
      OrderDCAssignmentLineNum: string;
      SKU: string;
      ShippedQty: number;
      CentralOrderLineNum: number | string;
    }

    interface ShipmentPackages {
      ShipmentPackage: {
        PackageID: string | number;
        PackageTrackingNumber: number;
      },
      ShippedItems: Array<ShippedItems>,
    }

    interface InputShipments {
      ShipmentHeader: {
        ShipmentID: number | string;
        WarehouseID: number | string;
        ShippingCarrier: number | string;
        ShippingClass: number | string;
        MainTrackingNumber: number | string;
        MainReturnTrackingNumber: number | string;
        OrderDCAssignmentNum: number | string;
        DistributionCenterNum: number | string;
        ChannelOrderID: number | string;
        ShipmentType: number | string;
        ShipmentReferenceID: number | string;
      }
      PackageItems: Array<ShipmentPackages>;
    }

    export interface Shipments {
      InputShipments: Array<InputShipments>;
    }

    export interface AttributesChannels {
      channelCategory: string;
      channelLogoURL: string;
      channelName: string;
      channelNum: number;
    }

    export interface ChannelsIntegration {
      allowOauth: boolean,
      category: string;
      channelLogoURL: string;
      channelName: string;
      channelNum: number;
      currency: string;
      platformName: string;
      platformNum: number;
    }

    export interface IPostProfileRolesByRolePayload {
      roleNum: number;
      permissionNum: number;
      permissionLevel: number;
      masterAccountNum: number;
      profileNum: number;
    }

    export interface IGetProfileRolesByRoleResponse {
      assignedByEmail: string;
      enterDate: string;
      masterAccountNum: number;
      permissionLevel: number;
      permissionName: string;
      permissionNum: number;
      profileNum: number;
      roleCode: string;
      roleName: string;
      roleNum: number;
      rowNum: number;
    }

    export interface IGetProfileRolesResponse {
      rowNum: number;
      masterAccountNum?: number;
      profileNum?: number;
      roleCode?: string;
      roleName: string;
      note: string;
      isActivated?: boolean;
    }

    export interface PlatformMetadata {
      ChannelMetaDataNum: number;
      SettingName: 'Country' | 'Retailer' | 'NickName' | string;
      DisplayName: string;
      RetrievedByUI: number;
      Category: string;
      ActivateStatus: number;
      SettingType: number;
      Order: number;
    }

    export interface Platform {
      ChannelNum: number;
      ChannelName: string;
      Currency: string;
      Category: string;
      MetaDataList: PlatformMetadata[];
      PlatformNum: number;
      PlatformName: string;
    }

    export interface ProductClassificationAttribute {
      ClassificationName: string;
      ProductAttributeNum: number;
      DefaultValue: string;
      OptionList: string;
      AttributeName: string;
    }


    export interface Customer {
      rowNum?: number;
      digit_seller_id?: string;
      customerUuid?: string;
      customerCode?: string;
      customerName: string;
      contact?: string;
      contact2?: string;
      contact3?: string;
      phone1?: string;
      phone2?: string;
      phone3?: string;
      Phone4?: string;
      email?: string;
      website?: string;
      customerType?: number;
      customerStatus?: number;
      businessType?: string;
      priceRule?: string;
      firstDate?: string; // date
      currency?: string;
      creditLimit?: number; // double
      taxRate?: number; // double
      discountRate?: number; // double
      shippingCarrier?: string;
      shippingClass?: string;
      shippingAccount?: string;
      priority?: string;
      area?: string;
      region?: string;
      districtn?: string;
      zone?: string;
      taxId?: string;
      resaleLicense?: string;
      classCode?: string;
      departmentCode?: string;
      divisionCode?: string;
      sourceCode?: string;
      terms?: string;
      termsDays?: number;
      updateDateUtc?: string;// $date-time
      enterBy?: string;
      updateBy?: string;
    }

    export interface CustomerAddress {
      rowNum?: number;
      enterDateUtc?: string;
      addressUuid?: string;
      addressCode: string;
      addressType?: number;
      description?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      suffix?: string;
      company?: string;
      companyJobTitle?: string;
      attention?: string;
      addressLine1?: string;
      addressLine2?: string;
      addressLine3?: string;
      city?: string;
      state?: string;
      stateFullName?: string;
      postalCode?: string;
      postalCodeExt?: string;
      county?: string;
      country?: string;
      email?: string;
      daytimePhone?: string;
      nightPhone?: string;
      updateDateUtc?: string;
      enterBy?: string;
      updateBy?: string;
    }

    export interface CustomerPostBody {
      customer: Customer;
      customerAddress: Array<CustomerAddress>;
      customerAttributes: {}
    }

    export interface CustomerFormBody extends Customer {
      customerAddress: Array<CustomerAddress>;
    }

    export interface ProductClassification {
      ActionType: number;
      AttributeCount: number;
      Attributes: ProductClassificationAttribute[];
      ClassificationId: string;
      ClassificationName: string;
      ClassificationDesc: string;
      ClassificationNum: number;
      CreatedBy: string;
      // datetime string
      CreatedOn: string;
      DatabaseNum: number;
      // datetime string
      LastUpdated: string;
      UpdatedBy: string;
      MasterAccountNum: number;
      ProductCount: number;
      ProfileNum: number;
      Selected?: number;
    }

    export interface AttributeClassificationProfile {
      AttributeNum?: number;
      ClassificationName: string;
      ClassificationNum: number;
      ClassificationOptionList?: {
        OptionValue: string;
      }[];
      OptionList?: string;
      DefaultValue?: string;
      MasterAccountNum?: number;
      ProfileNum?: number;
      Selected?: number;
    }

    export interface AttributeClassification {
      AttributeNum: number;
      ClassificationName: string;
      ClassificationNum: number;
      ClassificationOptionList: {
        OptionValue: string;
      }[];
      DefaultValue: string;
      MasterAccountNum: number;
      OptionList: string;
      ProfileNum: number
    }

    export interface StylesVariation {
      colorPatternCode?: Array<object>
      lengthCode?: Array<object>;
      sizeCode?: Array<object>;
      widthCode?: Array<object>;
      useColorPatternCode?: boolean;
      useLengthCode?: boolean;
      useWidthCode?: boolean;
      useSizeCode?: boolean;
    }

    export interface DistributionCenter {
      AddressLine1: string;
      AddressLine2: string;
      BusinessHours: string;
      City: string;
      CompanyName: string;
      ContactEmail: string;
      ContactName: string;
      ContactPhone: string;
      DistributionCenterCode: string;
      DistributionCenterID: string;
      DistributionCenterName: string;
      DistributionCenterStatus: number;
      DistributionCenterType: number;
      Email: string;
      Fax: string;
      IsDefault: number;
      MainPhone: string;
      MasterAccountNum: number;
      Notes: string;
      Priority: number;
      ProfileNum: number;
      State: string;
      Website: string;
      ZipCode: string;
    }

    export interface Inventory {
      DistributionCenterName: string;
      DistributionCenterId: string;
      DistributionCenterCode: string;
      DistributionCenterType: number;
      AvailableQuantity: number;
    }

    export interface ProductAttribute {
      AttributeId: string;
      AttributeNum?: number;
      AttributeChannelNum: number;
      AttributeChannelAccountNum?: number;
      AttributeDataType: number;
      AttributeName: string;
      AttributeOptionList: {
        OptionValue: string;
      }[];
      AttributeOptionMasterList: {
        OptionValue: string;
      }[];
      AttributeType: number;
      DefaultValue?: string | undefined;
      Group1?: string;
      Group2?: string;
      Group3?: string;
      MasterAccountNum?: number;
      OptionList?: string;
      ProfileNum?: number;
      Classifications?: AttributeClassification[];
      AttributeClassificationProfiles?: AttributeClassificationProfile[] | null;
      AttributeClassifyValueObjects?: any;
      hidden?: boolean;
    }

    export interface ILabel {
      ProductLabelId: string,
      ActionType?: number,
      ProductLabelNum?: number,
      ProductLabelName: string,
      ProductLabelDesc: string,
      DatabaseNum?: number,
      MasterAccountNum?: number,
      ProfileNum?: number,
      CreatedBy?: string,
      CreatedOn?: string,
      LastUpdated?: string,
      ProductCount?: number,
    }

    export interface IAttributeSet {
      rowNum?: number,
      attributeSetType?: number,
      attributeSetName: string,
      attributeSetStatus?: number,
      attributeSetDescription: string,
      masterAccountNum?: number,
      profileNum?: number,
      createdBy?: string,
      createdOn?: string,
      lastUpdated?: string,
    }

    export interface ProfileChannelAccount {
      PlatformNum: number;
      MasterAccountNum: number;
      ProfileNum: number;
      ChannelNum: number;
      ChannelAccountNum: number;
      ChannelName: string;
      ChannelAccountName: string;
      ChannelCategory: string;
      CHNLCtrlFlagNum?: number;
    }

    export interface ProductChannelAccount {
      Brand: string;
      CentralProductNum: number;
      MediaURL: string;
      ProductId: string;
      SKU: string;
      ProductTitle: string;
      Type: string;
    }

    export interface ProductProfile {
      ASIN: string;
      BoxHeight: number;
      BoxLength: number;
      BoxWidth: number;
      Brand: string;
      CentralProductNum: number;
      Cost: number;
      CreatedBy: string;
      /**
       * Datetime string
       */
      CreateDate: string;
      DatabaseNum: number;
      FNSku: string;
      GrossWeight: number;
      LongDescription: string;
      MSRP: number;
      Manufacturer: string;
      MediaURL: string;
      ProductId: string;
      SKU: string;
      ProductTitle: string;
      ShortDescription: string;
      Type: string;
      UPC: string;
      Price: number;
      ListingChannelStatus: string;
      Labels: number;
      KeyProductId: number;
      IsBlocked: number;
      Images: number;
      Classification: string;
      ClassificationId: string;
      QtyTotal: number;
    }

    export interface MediaPlacement {
      ActionType: number;
      CreatedBy: string;
      // Datetime string
      CreatedOn: string;
      DatabaseNum: number;
      DispSequenceNum: number;
      UpdatedBy: string;
      // Datetime string
      LastUpdated: string;
      MasterAccountNum: number;
      ProfileNum: number;
      MediaPlacementId: string;
      MediaPlacementName: string;
      MediaPlacementNum: number;
      MediaPlacementRELPId: string;
      MediaType: number;
      EditType?: number;
      MediaURL?: string;
      ProductCount: number;
    }

    interface ProductBasicInfo {
      ASIN: string;
      AvgCost: number;
      BoxHeight: number;
      BoxLength: number;
      BoxWidth: number;
      Brand: string;
      BundleType: number;
      CentralProductNum: number;
      ClassificationNum: number;
      Condition: number;
      CopyToChildren: number;
      Cost: number;
      CreateBy: string;
      CreateDate: string;
      DatabaseNum: number;
      DimensionUnit: number;
      EAN: string;
      FNSku: string;
      GrossWeight: number;
      HarmonizedCode: string;
      ISBN: string;
      IsBlocked: number;
      IsInRelationship: number;
      LongDescription: string;
      MAPPrice: number;
      MPN: string;
      MSRP: number;
      Manufacturer: string;
      MasterAccountNum: number;
      MultipackQuantity: number;
      NetWeight: number;
      Price: number;
      ProductHeight: number;
      ProductLength: number;
      ProductTitle: string;
      ProductType: number;
      ProductWidth: number;
      ProfileNum: number;
      SKU: string;
      ShortDescription: string;
      Subtitle: string;
      TaxProductCode: string;
      UPC: string;
      UpdateBy: string;
      UpdateDate: string;
      VariationParentSKU: string;
      VariationVaryBy: any
      Warranty: string;
      WeightUnit: number;
    }

    export interface StyleMasterGenerateSKUsColumns {
      sku: string;
      retailPrice: number;
      widthCode: string;
      lengthCode: string;
      sizeCode: string;
      colorCode: string;
    }

    export interface StyleMasterItemList {
      attributeList: any[];
      erpCode: {
        sizeCode?: string,
        colorCode?: string,
        lengthCode?: string,
        widthCode?: string,
      };
      retailPrice: number;
      styleSKU: string;
      productId?: stirng;
    }
    export interface StyleMasterPayload {
      productId?: string;
      basic: object;
      itemPatternAllCaps: boolean;
      itemPatternArr: string[];
      labelArr: string[];
      channelControlFlagArr: string[];
      classificationArr: string[];
      mediaPlacementList: object;
      attributeList: object;
      styleMasterItemList: StyleMasterItemList[];
    }

    export interface DcList {
      AvailableQuantity: number;
      DistributionCenterId: string;
      DistributionCenterName: string;
      EditType: number;
      ProductDCRELPId: string;
    }

    export interface ProductQuantityItem {
      DistributionCenterName: string;
      Code: string;
      RowNum: string;
      Type: number;
      Quantity: number;
    }

    export interface ProductAttributeItem {
      AttributeName: string;
      Value: string;
      RowNum: number;
      AttributeType?: number;
    }

    export interface OrderDetailsSummary {
      centerEnterDateUtc: string;
      centralOrderNum: number;
      channelAccountName: string;
      channelName: string;
      channelNum: number;
      channelOrderID: string;
      currency: string;
      deliverByDateUtc: string;
      appOrderId: string;
      distributionCenterName: string;
      endBuyerName: string;
      estimatedShipDateUtc: string;
      mappedShippingCarrier: string;
      mappedShippingService: string;
      orderStatus: number;
      orderStatusName: string;
      originalOrderDateUtc: string;
      paymentMethod: string;
      paymentStatus: number;
      paymentStatusName: string;
      requestedShippingCarrier: string;
      requestedShippingService: string;
      secondaryChannelOrderID: string;
      shipToZip: string;
      subtotalOrderAmount: number;
      totalDiscountAmount: number;
      totalItemOrderQty: number;
      totalOrderAmount: number;
      totalShippingAmount: number;
      totalTaxAmount: number;
    }

    interface OrderDetailsDetail {
      billing: object;
      items: Array<any>;
      shipping: object;
      summary: OrderDetailsSummary;
    }

    interface OrderDetailsHistory {
      orderActivitys: Array<object>;
      orderTransactions: Array<object>;
    }

    export interface OrderDetails {
      conversationLogs: Array<object>;
      detail: OrderDetailsDetail;
      history: OrderDetailHistory;
      shipments: Array<object>;
    }

    export interface SalesOrderCustomers {
      area: string;
      businessType: string;
      classCode: string;
      contact: string;
      contact2: string;
      contact3: string;
      creditLimit: number;
      currency: string;
      customerCode: string;
      customerName: string;
      customerStatusText: string;
      customerUuid: string;
      departmentCode: string;
      digit_seller_id: string;
      districtn: string;
      divisionCode: string;
      email: string;
      firstDate: string;
      phone1: string;
      phone2: string;
      phone3: string;
      phone4: string;
      priceRule: string;
      priority: string;
      region: string;
      resaleLicense: string;
      rowNum: number;
      shippingAccount: string;
      shippingCarrier: string;
      shippingClass: string;
      sourceCode: string;
      taxId: string;
      terms: string;
      termsDays: number;
      webSite: string;
      zone: string;
    }

    export interface SalesOrderDetails {
      salesOrderHeader: {
        rowNum: number,
        uniqueId: string,
        enterDateUtc: string,
        appGuid: string,
        salesOrderUuid: string,
        orderNumber: string,
        orderType: number,
        orderStatus: number,
        orderDate: string,
        orderTime: string,
        shipDate: string,
        dueDate: string,
        billDate: string,
        customerUuid: string,
        customerCode: string,
        customerName: string,
        terms: string,
        termsDays: number,
        currency: string,
        subTotalAmount: number,
        salesAmount: number,
        totalAmount: number,
        taxableAmount: number,
        nonTaxableAmount: number,
        taxRate: number,
        taxAmount: number,
        discountRate: number,
        discountAmount: number,
        shippingAmount: number,
        shippingTaxAmount: number,
        miscAmount: number,
        miscTaxAmount: number,
        chargeAndAllowanceAmount: number,
        paidAmount: number,
        creditAmount: number,
        balance: number,
        unitCost: number,
        avgCost: number,
        lotCost: number,
        orderSourceCode: string,
        updateDateUtc: string,
        enterBy: string,
        updateBy: string
      },
      salesOrderHeaderInfo: {
        rowNum: number,
        uniqueId: string,
        enterDateUtc: string,
        appGuid: string,
        salesOrderUuid: string,
        centralFulfillmentNum: number,
        shippingCarrier: string,
        shippingClass: string,
        distributionCenterNum: number,
        centralOrderNum: number,
        channelNum: number,
        channelAccountNum: number,
        channelOrderID: string,
        secondaryChannelOrderID: string,
        shippingAccount: string,
        warehouseUuid: string,
        warehouseCode: string,
        refNum: string,
        customerPoNum: string,
        endBuyerUserID: string,
        endBuyerName: string,
        endBuyerEmail: string,
        shipToName: string,
        shipToFirstName: string,
        shipToLastName: string,
        shipToSuffix: string,
        shipToCompany: string,
        shipToCompanyJobTitle: string,
        shipToAttention: string,
        shipToAddressLine1: string,
        shipToAddressLine2: string,
        shipToAddressLine3: string,
        shipToCity: string,
        shipToState: string,
        shipToStateFullName: string,
        shipToPostalCode: string,
        shipToPostalCodeExt: string,
        shipToCounty: string,
        shipToCountry: string,
        shipToEmail: string,
        shipToDaytimePhone: string,
        shipToNightPhone: string,
        billToName: string,
        billToFirstName: string,
        billToLastName: string,
        billToSuffix: string,
        billToCompany: string,
        billToCompanyJobTitle: string,
        billToAttention: string,
        billToAddressLine1: string,
        billToAddressLine2: string,
        billToAddressLine3: string,
        billToCity: string,
        billToState: string,
        billToStateFullName: string,
        billToPostalCode: string,
        billToPostalCodeExt: string,
        billToCounty: string,
        billToCountry: string,
        billToEmail: string,
        billToDaytimePhone: string,
        billToNightPhone: string,
        notes: string,
        updateDateUtc: string,
        enterBy: string,
        updateBy: string
      },
      salesOrderHeaderAttributes: {
        rowNum: number,
        uniqueId: string,
        enterDateUtc: string,
        appGuid: string,
        salesOrderUuid: string,
        fields: object,
      },
      salesOrderItems: Array<object>
    }

    export interface ProductMedia {
      EditType: number;
      ProductMediaRELPId: string;
      MediaPlacementName: string;
      DispSequenceNum: number;
      MediaPlacementId: string;
      MediaURL: string;
    }

    export interface ProductExts {
      data: {
        inventory: {
          productBasic: {
            sku: string,
            rowNum: number;
          };
          productExt: {
            productUuid: string,
            rowNum: number;
          };
          productExtAttributes: object;
          inventory: Array<object>
        }
      }
    }

    export interface ProductData {
      AttributeList: any;
      ProductBasic: ProductBasicInfo;
      BundleComponents: any;
      ClassificationLists: any;
      DcList: Array<DcList>
      FlagList: any;
      LabelList: any;
      LastSold: string;
      MediaList: Array<ProductMedia>;
      PageType: number;
      VariationChildren: any;
      VaryByList: any;
    }

    export interface ChannelProfile {
      displayAnalyzeData?: boolean;
      channelNum: number;
      channelName: string;
      currency: string;
      category: string;
      channelLogoURL: string;
      allowOauth: number;
      platformNum: number;
      platformName: string;
      CHNLCtrlFlagNum?: number;
    }

    export interface LoginProfile {
      ProfileNum: number;
      MasterAccountNum: number;
      DisplayName: string;
      Email: string;
    }

    export interface ProfileUserPermission {
      RowNum: number;
      Email: string;
      UserName: string;
      MasterAccountNum: number;
      ProfileNum: number;
      PermissionNum: number;
      PermissionName: string;
      PermissionLevel: number;
      AssignedByEmail: string;
      /**
       * Datetime string
       */
      Enterdate: string;
    }

    export interface ImportFileProfile {
      ErrorFileName: string;
      FileName: string;
      FileSize: number;
      ImportStatus: number;
      ImportType: number;
      /**
       * Datetime string
       */
      RequestedTime: string;
      RequesterEmail: string;
      SystemFileName: string;
    }

    export interface ChannelAccountObj {
      ChannelNum: number;
      ChannelName: string;
      ChannelAccountNum: number;
      MasterAccountNum: number;
      ProfileNum: number;
      ChannelCompanyName: string;
      ChannelAccountName: string;
      ChannelAuthorizationStatus: number;
      ChannelActivateStatus: number;
      ChannelFeeRate: number;
      Notes: string;
      PlatformName: string;
      PlatformNum: number;
      MetaDataList: {
        SettingValue: string;
        SettingDetailValue: string;
        SettingType: number;
        CreateBy: string;
        UpdateBy: string;
        CreateDate: string;
        UpdateDate: string;
        ChannelMetaDataNum: number;
        SettingName: string;
        DisplayName: string;
        RetrievedByUI: number;
        Category: string;
        ActivateStatus: number;
        Order: number;
      }[];
    }

    export type SchedulingSettings = {
      Update: boolean;
      Enabled: boolean;
      NeedTemplate: boolean;
      Start: string;
      End: string;
      Period: string;
      Options: {
        DisplayName: string;
        Value: string;
      }[];
    };

    export type DistributionCenterWarehouseMapping = {
      DistributionCenterNum: number;
      Name: string;
      Code: string;
      City: string;
      ChannelAccountWarehouseCode: string;
    };

    export type SalesProducts = {
      inventoryList: Array<object>;
      inventoryListCount: number;
    };

    export type Customers = {
      customerList: Array<SalesOrderCustomers>;
      customerListCount: number;
    };

    export type InventorySchedulingSettings = SchedulingSettings & {
      SendPercentageTotalQty: number;
      MaxQty: string;
      LessQty: string;
      SendUnits: string;
      UseAssignedInventory: boolean;
      DistributionCenterWarehouseMappings: DistributionCenterWarehouseMapping[];
    };

    export type ChannelAccountProfileSetting = {
      ChannelAccountSettingNum: number;
      MasterAccountNum: number;
      ProfileNum: number;
      ChannelNum: number;
      ChannelAccountNum: number;
      ChannelFlagNum: number;
      BasicSetting: {
        NickName: string;
        NickNameReq: string;
        Country: string;
        CountryReq: string;
        Rate: string;
        RateReq: string;
        ChannelConnectionUrl: string;
        ChannelConnectReq: string;
        UserName: string;
        UserNametReq: string;
        SecretAPIKey: string;
        SecretAPIKeyReq: string;
        SecretPassword: string;
        SecretPasswordReq: string;
        ChannelFlag: string;
        Options: {
          DisplayName: string;
          Value: string;
        }[];
      };
      ScheduleSetting: {
        [key: string]: SchedulingSettings;
        InventorySettings: InventorySchedulingSettings;
        UpdatedBy: string
      };
    };

    interface BaseUSState {
      masterAccountNum: number;
      profileNum: number;
      state: string;
      /**
       * Datetime string
       */
      enterDate: string;
    }

    interface WarehouseState extends BaseUSState {
      warehouseStateNum: number;
    }

    interface RequiredTaxState extends BaseUSState {
      requiredTaxStateNum: number;
    }

    interface Company {
      companyNum: number;
      masterAccountNum: number;
      profileNum: number;
      companyType: number;
      logo: string;
      name: string;
      description: string;
      primaryContactFirstName: string;
      primaryContactLastName: string;
      primaryContactEmail: string;
      primaryContactPhone: string;
      corporateAddressLine1: string;
      corporateAddressLine2: string;
      corporateAddressCity: string;
      corporateAddressState: string;
      corporateAddressZip: string;
      corporateAddressCountry: string;
      billingAddressLine1: string;
      billingAddressLine2: string;
      billingAddresCity: string;
      billingAddressState: string;
      billingAddressZip: string;
      billingAddressCountry: string;
      facebookUrl: string;
      youtubeUrl: string;
      pinterestUrl: string;
      websiteUrl: string;
      /**
       * Datetime string
       */
      enterDate: string;
      /**
       * Datetime string
       */
      lastUpdate: string;
    }

    interface SupplierConfig {
      supplierConfigNum: number;
      masterAccountNum: number;
      profileNum: number;
      listPreference: number;
      inventoryWarehousePublishRule: number;
      /**
       * Datetime string
       */
      enterDate: string;
      /**
       * Datetime string;
       */
      lastUpdate: string;
    }

    interface SellerConfig {
      sellerConfigNum: number;
      masterAccountNum: number;
      profileNum: number;
      listPreference: number;
      /**
       * Datetime string
       */
      enterDate: string;
      /**
       * Datetime string
       */
      lastUpdate: string;
    }

    interface TaxID {
      taxIDNum: number;
      masterAccountNum: number;
      profileNum: number;
      id: string;
      state: string;
      country: string;
      /**
       * Datetime string
       */
      enterDate: string;
      /**
       * Datetime string
       */
      lastUpdate: string;
    }

    interface SupplierConfigItem {
      supplierConfig: SupplierConfig;
      warehouseStates: WarehouseState[];
      requiredTaxStates: RequiredTaxState[];
      company: Company;
    }

    interface SellerConfigItem {
      sellerConfig: SellerConfig;
      taxIds: TaxID[];
      company: Company;
    }

    interface OPTProductAttribute {
      AttributeId: string;
      AttributeName: string;
      OriginalValue: string;
      NewValue: string;
    }

    interface OPTProduct {
      SKU: string;
      CentralProductId: string;
      ProductAttributeAssignedList: OPTProductAttribute[];
    }

    interface OPTFilter {
      OPTFilterId: string;
      ParameterName: number;
      ParameterValue: string;
    }

    interface OPT {
      OPTId: string;
      OPTLabel: string;
      /**
       * Datetime string
       */
      CreateDate: string;
      /**
       * Datetime string
       */
      StartDate: string;
      /**
       * Datetime string
       */
      EndDate: string;
      Channel: string;
      ProductCount: number;
      Status: number;
      FileName: string;
      SystemFileName: string;
    }

    interface CommerceCentralOPTAttribute {
      AttributeId: string;
      AttributeName: string;
    }

    interface CommerceCentralOPTSKUListingObj {
      ProductId: string;
      SKU: string;
      ClassificationId: string;
      ClassificationName: string;
      ChannelCTRLFlagId: string;
      ChannelCTRLFlagName: string;
      AttributeId: string;
      AttributeName: string;
    }

    interface CommerceCentralOPTProductAttribute {
      AttributeId: string;
      AttributeName: string;
      OriginalValue: string;
      NewValue: string;
    }

    interface CommerceCentralOPTProduct {
      SKU: string;
      CentralProductId: string;
      ProductAttributeAssignedList: CommerceCentralOPTProductAttribute[];
    }

    interface CommerceCentralOPTDetailProduct extends Omit<FormModels.CommerceCentralOPTDetailProduct, 'Period' | 'ProductList'> {
      StartDate: string;
      EndDate: string;
      ProductList: CommerceCentralOPTProduct;
      FilterList: Array;
    }

    interface ExportFile {
      /**
       * Client-side assigned unique identifier to prevent render issues
       */
      $uid?: string;
      FileName: string;
      RequestEmail: string;
      ExportReportType: ExportReportType;
      /**
       * Datetime string
       */
      RequestTime: string;
      ExportStatus: ExportStatus;
      FileSize: number;
    }

    interface SimpleOrder {
      /**
       * Frontend-assigned value as the API does not yield items with unique identifiers.
       */
      uid?: string;
      appOrderId: string;
      channelNum: number;
      channelName: string;
      centralOrderNum: number;
      channelOrderId: string;
      endBuyerName: string;
      endBuyerEmail: string;
      /**
       * Datetime string
       */
      originalOrderDateUtc: string;
      orderStatus: number;
      billToName: string;
      shipToName: string;
      subtotalOrderAmount: number;
      totalOrderAmount: number;
    }

    interface SimpleOrderProductDetail {
      centralProductNum: number;
      productTitle: string;
      totalSellingAmount: number;
      totalSellingProductCount: number;
      sku: string;
    }

    interface SimpleOrderSKUInfo {
      channelName: string;
      channelNum: number;
      totalCanceledCount: number;
      totalOrderAmount: number;
      totalOrderCount: number;
      totalProcessingCount: number;
      totalShippedCount: number;
      productDetail: SimpleOrderProductDetail[];
    }

    interface SimpleShipment {
      appOrderId: string;
      shipmentNum: number;
      channelName: string;
      channelOrderID: string;
      /**
       * Datetime string
       */
      originalOrderDateUtc: string;
      /**
       * Datetime string
       */
      shippedDateUtc: string;
      shipToName: string;
      endBuyerEmail: string;
      trackingNumber: string;
      orderQty: number;
      orderStatus: number;
      orderStatusName: string;
    }

    interface ShippingProducts {
      alternateCode: string;
      avaQty: number;
      brand: string;
      bundleType: number;
      categoryCode: string;
      classCode: string;
      colorPatternCode: string;
      condition: number;
      departmentCode: string;
      divisionCode: string;
      fNSku: string;
      groupCode: string;
      instock: number;
      inventoryUuid: string;
      mSRP: number;
      manufacturer: string;
      model: string;
      oEMCode: string;
      price: number;
      priceRule: string;
      productTitle: string;
      productType: number;
      productUuid: string;
      qtyPerCase: number;
      remark: string;
      sKU: string;
      salesCost: number;
      subClassCode: string;
      subGroupCode: string;
      uOM: string;
      uPC: string;
      warehouseCode: string;
    }

    export interface ProductTemplate {
      productMappingNum: number;
      channelAccountNum: number;
      channelDisplayName: string;
      channelNum: number;
      masterAccountNum: number;
      profileNum: number;
    }

    export interface MappingContentProfile {
      MasterAccountNum: number;
      ProfileNum: number;
      ChannelNum: number;
      ChannelAccountNum: number;
      MappingTypeNum: ChannelAccountTemplateMappingType;
      Name: string;
      MappingContentID: string;
      ProductMappingNum: number;
    }
  }

  declare namespace FormModels {
    export interface InventorySchedulingSettings extends Omit<Entities.InventorySchedulingSettings, 'DistributionCenterWarehouseMappings'> {
      DistributionCenterWarehouseMappings: { [key: string]: Entities.DistributionCenterWarehouseMapping };
      bools: {
        SendPercentageTotalQty: boolean;
        MaxQty: boolean;
        LessQty: unknown;
      };
    }

    export interface IntegrationSettings extends Omit<Entities.ChannelAccountProfileSetting, 'ScheduleSetting'> {
      ScheduleSetting: {
        [key: string]: Entities.SchedulingSettings;
        InventorySettings: InventorySchedulingSettings;
      };
    }

    export interface CommerceCentralOPTDetailProductFilterItem {
      OPTFilterId: string;
      ParameterName: 1 | 2 | 3;
      ParameterValue: string | string[] | number;
    }

    export interface CommerceCentralOPTProduct {
      SKU: string;
      CentralProductId: string;
      ProductAttributeAssignedList: Entities.CommerceCentralOPTProductAttribute[];
      // Values below this comment are meant to be frontend-only
      MediaURL: string;
      $instance: Entities.ProductProfile;
    }

    export interface CommerceCentralOPTDetailProduct {
      OPTLabel: string;
      Period: [Moment, Moment];
      FileName: string;
      FilterList: CommerceCentralOPTDetailProductFilterItem[];
      ProductList: CommerceCentralOPTProduct[];
    }
  }

  declare namespace api {
    export interface ProfileChannelAccount {
      masterAccountNum: number;
      profileNum: number;
      channelNum: number;
      channelAccountNum: number;
      channelName: string;
      channelAccountName: string;
    }

    export interface Pagination {
      $top?: number;
      $skip?: number;
      $count?: boolean;
    }
  }

  declare namespace Utils {
    export interface DispatchAction<T> {
      type: T;
      params?: any;
    }
  }

  declare namespace DataGridTypes {
    export interface RenderProps<T> {
      value: any;
      data: T;
      cellProps: {
        id: string,
        data: T,
        value: any,
        rowIndex: number,
        columnIndex: number,
        inEdit: boolean,
        editProps: any;
      };
      rowIndex: number;
      rowSelected: boolean;
      rowActive: boolean;
      cellSelected: boolean;
      empty: boolean;
      totalDataCount: number;
      rowExpanded: boolean;
      toggleRowExpand: () => void;
      setRowExpanded: (value: boolean) => void;
      loadNodeAsync: Function;
      toggleNodeExpand: () => void;
      rendersInlineEditor: boolean;
    }
  }
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}
