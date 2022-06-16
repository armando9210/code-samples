export enum PermissionsLevels {
  NONE,
  VIEW,
  VIEW_EDIT,
  ADMIN = 4,
}

export enum ProductType {
  STANDARD = 0,
  PARENT,
  BUNDLE,
  CHILD,
  ALL,
}

export enum ProductAttributeType {
  NORMAL = 1,
  CLASSIFICATION_ONLY,
  RESERVED,
  MEDIA,
  IMPORT_ATTRIBUTE,
}

export enum ProductAttributeDataType {
  STRING = 1,
  INTEGER,
  DECIMAL,
  DATETIME,
  IMAGEURL,
  PRICE,
  IMAGEURLLIST,
  VIDEOURL,
}

export enum MediaType {
  IMAGE = 1,
  VIDEO,
  OTHER = 100,
}

export enum FileImportStatus {
  PENDING = 1,
  PROCESSING,
  COMPLETE,
  COMPLETED_WITH_ERROR,
  FAILED_VALIDATION,
  CONTACT_SUPPORT,
  FAILED,
}

export enum FileImportType {
  INVENTORY = 20002,
  PRODUCT_CREATE_EDIT = 1003,
  ATTRIBUTES_CREATE,
  ATTRIBUTES_EDIT,
  ORDERS = 2001,
  TRACKING_NUMBER = 3001,
  LOOKUP = 5001,
  STYLE_MASTER_CREATE = 30001,
  STYLE_MASTER_UPDATE = 30002,
  STYLE_MASTER_ASSIGN = 30003,
  STYLE_MASTER_GROUP = 30005,
  PRODUCT_ALIAS = 50001,
}

export enum DistributionCenterType {
  WAREHOUSE = 1,
  DROPSHIP,
  RETAILER_STORE,
}

export enum ChannelAccountEventType {
  UNKNOWN = 'Unknown',
  ACKNOWLEDGE = 'Acknowledge',
  ORDER_SHIPMENT = 'OrderShipment',
  ORDER_CANCEL = 'OrderCancel',
  ORDER_REFUND = 'OrderRefund',
  CATALOG_CREATE = 'CatalogCreate',
  CATALOG_UPDATE = 'CatalogUpdate',
  INVENTORY_SYNC = 'InventorySync',
  INVOICE_SYNC = 'InvoiceSync',
}

export enum CustomerAddressType {
  Main,
  Secondary,
  Third,
  Other,
}

export enum CustomerStatusType {
  Onboarding,
  Trial,
  Contract,
}

export enum CustomerType {
  MajorClient,
  PopShop,
  Normal,
}

export enum ProductReportType {
  All = 10001,
  ProductBasic = 1001,
  Channels = 2001,
  Labels = 3001,
  Attributes = 4001,
  DistributionCenters = 5001,
  MediaPlacements = 6001,
  BundleComponents = 7001,
  Categories = 8001,
  Classification = 9001,
}

export enum ProductOptimizationImportStatus {
  UNKNOWN,
  QUEUE,
  IN_PROGRESS,
  COMPLETE,
  COMPLETE_WITH_ERROR,
  FAILED_VALIDATION,
  FAILED = 7,
  DOWNLOAD,
}

export enum OPTFilterCategory {
  CLASSIFICATION = 1,
  CHANNEL,
  ATTRIBUTE,
}

export enum ExportReportType {
  PRODUCT_BASIC = 1001,
  CHANNELS = 2001,
  LABELS = 3001,
  ATTRIBUTES = 4001,
  DISTRIBUTION_CENTERS = 5001,
  BUNDLE_COMPONENTS = 7001,
  CATEGORIES = 8001,
  CLASSIFICATION = 9001,
  ALL = 10001,
  CHANNEL_LOOKUP = 20001,
  CHANNEL_ACCOUNT_INVENTORY = 20002,
  CHANNEL_ACCOUNT_IMPORTED_FILE = 20003,
  CHANNEL_ACCOUNT_MAPPED_FILE = 20004,
  CHANNEL_ACCOUNT_STATIC_FILE = 20005,
}

export enum ExportStatus {
  UNKNOWN,
  QUEUE = 1,
  IN_PROGRESS,
  COMPLETE,
  COMPLETED_WITH_ERROR,
  FAILED_VALIDATION = 5,
  CONTACT_SUPPORT = 6,
  FAILED = 7,
}

export enum OrderStatus {
  PROCESSING = 0,
  SHIPPED,
  PARTIALLY_SHIPPED,
  PENDING_SHIPMENT = 4,
  READY_TO_PICKUP = 8,
  CANCELED = 16,
  ON_HOLD = 128,
}

export enum IntegrationScheduleSettingsSection {
  INVENTORY_SETTINGS = 'InventorySettings',
  INVOICE_SETTINGS = 'InvoiceSettings',
  ORDER_SETTINGS = 'OrderSettings',
  PRODUCT_SETTINGS = 'ProductSettings',
  REFUND_SETTINGS = 'RefundSettings',
  SHIPPING_SETTINGS = 'ShippingSettings',
}

export enum ChannelAccountTemplateMappingType {
  UNKNOWN,
  CATALOG_TO_CHANNEL = 1,
  INVENTORY_TO_CHANNEL,
  CATALOG_TO_RETAIL,
  INVENTORY_TO_RETAIL,
  OTHERS,
}
