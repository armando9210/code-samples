import { FormInstance } from 'antd';
import React from 'react';
import { Type } from '../../components/common/FormElement';

export type FormsContextType = { mainForm?: FormInstance, attributeFilterForm?: FormInstance, channelInvFilterForm?: FormInstance, productFilterForm?: FormInstance };

export const FormsContext = React.createContext<FormsContextType>({});

export const bulkUpdateFields = (optAttributes:Entities.CommerceCentralOPTAttribute[], labels?: Array<Entities.ILabel>, basicChannels?: Array<object>) => ({
  basicInfo: [
    {
      formItemProperties:{
        label: 'Title',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ProductTitle')[0]?.AttributeId || 'ProductTitle',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'ProductTitle',
        maxLength: 120,
      },
      toolTip: 'Product Title. 120 character limit',
    },
    {
      formItemProperties: {
        label: 'Subtitle',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Subtitle')[0]?.AttributeId || 'Subtitle',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'Subtitle',
        maxLength: 100,
      },
      toolTip: 'Inventory product subtitle. 100 character limit',
    },
    {
      formItemProperties: {
        label: 'Short Description',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ShortDescription')[0]?.AttributeId || 'ShortDescription',
      },
      inputType: Type.TEXTAREA,

      inputProperties: {
        name: 'ShortDescription',
        maxLength: 100,
      },
      toolTip: 'Short description of the product (HTML-supported). 1,000 character limit.',
    },
    {
      formItemProperties: {
        label: 'Description',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'LongDescription')[0]?.AttributeId || 'LongDescription',
      },
      inputType: Type.TEXTAREA,
      inputProperties: {
        name: 'LongDescription',
        maxLength: 32000,
      },
      toolTip: 'Description of the product (HTML-supported). 32,000 character limit.',
    },
    {
      formItemProperties:{
        label: 'Labels',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'labels')[0]?.AttributeId || 'labels',
      },
      inputType: Type.SELECT,
      inputProperties: {
        name: 'labels',
        placeholder: 'Select Labels',
        mode: 'tags',
        style: { width: '100%' },
        optionFilterProp: 'title',
        options: labels?.map((c: any) => ({
          label: c.ProductLabelName,
          value: c.ProductLabelId,
          title: c.ProductLabelName,
        })) || [],
      },
      toolTip: 'Description of the product (HTML-supported). 32,000 character limit.',
    },
    {
      formItemProperties: {
        label: 'Channel Flags',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'channels')[0]?.AttributeId || 'channels',
      },
      inputType: Type.SELECT,
      inputProperties: {
        name: 'channels',
        placeholder: 'Select Channels',
        mode: 'multiple',
        value: [],
        style: { width: '100%' },
        filterOption: (value: any, option: any) => option?.label.toString().toLowerCase().includes(value.toLowerCase()),
        options: basicChannels?.map((c: any) => ({
          label: c.CHNLCtrlFlag,
          value: c.ProductCHNLCtrlFlagId,
        })) || [],
      },
    },
    {
      formItemProperties: {
        label: 'Condition',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Condition')[0]?.AttributeId || 'Condition',
      },
      inputType: Type.SELECT,
      inputProperties: {
        name: 'Condition',
        placeholder: 'Select a condition',
        value: 0,
        style: { width: '100%' },
        options: [
          {
            label: 'New',
            value: 0,
          },
          {
            label: 'Used',
            value: 1,
          },
          {
            label: 'Refurbished',
            value: 2,
          },
          {
            label: 'Reconditioned',
            value: 4,
          },
          {
            label: 'Like new',
            value: 8,
          },
        ],
      },
    },
    {
      formItemProperties: {
        label: 'Brand',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Brand')[0]?.AttributeId || 'Brand',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'Brand',
        maxLength: 150,
      },
      toolTip: 'Kind or make of the product. 150 character limit.',
    },
    {
      formItemProperties: {
        label: 'Manufacturer',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Manufacturer')[0]?.AttributeId || 'Manufacturer',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'Manufacturer',
        maxLength: 255,
      },
      toolTip: 'Name of the company that manufactures the product.',
    },
  ],
  pricing1: [
    {
      formItemProperties: {
        label: 'Retail price',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Price')[0]?.AttributeId || 'Price',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'Price',
        prefix: '$',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      formItemProperties: {
        label: 'Retail price',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'MSRP')[0]?.AttributeId || 'MSRP',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'Price',
        prefix: '$',
        min: 0,
        style: { width: '100%' },
      },
      toolTip: 'The manufacturer\'s suggested retail price',
    },
  ],
  pricing2: [
    {
      formItemProperties: {
        label: 'Sales Cost',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Cost')[0]?.AttributeId || 'Cost',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'Cost',
        prefix: '$',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      formItemProperties: {
        label: 'Average Cost',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'AvgCost')[0]?.AttributeId || 'AvgCost',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'AvgCost',
        prefix: '$',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      formItemProperties: {
        label: 'MAP',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'MAPPrice')[0]?.AttributeId || 'MAPPrice',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'MAPPrice',
        prefix: '$',
        min: 0,
        style: { width: '100%' },
      },
      toolTip: 'In its simplest form, minimum advertised pricing (MAP) is the lowest price a retailer can advertise the product for sale.',
    },
  ],
  technical1: [
    {
      formItemProperties: {
        label: 'UPC',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'UPC')[0]?.AttributeId || 'UPC',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'UPC',
        maxLength: 20,
      },
      toolTip: 'Universal Product Code',
    },
    {
      formItemProperties: {
        label: 'FNSku',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'FNSku')[0]?.AttributeId || 'FNSku',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'FNSku',
        maxLength: 10,
      },
      toolTip: 'Fulfillment Network Stock Keeping Unit (FNSKU) is an Amazon-unique term to describe the barcodes that help the eCommerce guru identify and track products and connect them to you, the seller. This product-identifying code is similar to a UPC and it’s used to help Amazon label your product in their fulfillment centers.',
    },
    {
      formItemProperties: {
        label: 'ISBN',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ISBN')[0]?.AttributeId || 'ISBN',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'ISBN',
        maxLength: 10,
      },
      toolTip: 'International Standard Book Number',
    },
    {
      formItemProperties: {
        label: 'EAN',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'EAN')[0]?.AttributeId || 'EAN',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'EAN',
        maxLength: 20,
      },
      toolTip: 'European Article Number',
    },
  ],
  technical2: [
    {
      formItemProperties: {
        label: 'ASIN',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ASIN')[0]?.AttributeId || 'ASIN',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'ASIN',
        maxLength: 10,
      },
      toolTip: 'Amazon Standard Identification Number',
    },
    {
      formItemProperties: {
        label: 'Tax Product Code',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'TaxProductCode')[0]?.AttributeId || 'TaxProductCode',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'TaxProductCode',
        maxLength: 25,
      },
      toolTip: 'Tax product code for this product (for reseller use; NOT sales tax). 25 character limit.',
    },
    {
      formItemProperties: {
        label: 'Harmonized Code',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'HarmonizedCode')[0]?.AttributeId || 'HarmonizedCode',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'HarmonizedCode',
        maxLength: 12,
      },
      toolTip: 'Internationally standard code for customs tariffs.',
    },
    {
      formItemProperties: {
        label: 'Warranty',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'Warranty')[0]?.AttributeId || 'Warranty',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'Warranty',
        maxLength: 255,
      },
      toolTip: 'Guarantee that the product meets certain criteria. 255 character limit.',
    },
    {
      formItemProperties: {
        label: 'MPN',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'MPN')[0]?.AttributeId || 'MPN',
      },
      inputType: Type.INPUT,
      inputProperties: {
        name: 'MPN',
        maxLength: 50,
      },
      toolTip: 'Manufacturer Part Number',
    },
  ],
  physical1: [
    {
      formItemProperties: {
        label: 'Length (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ProductLength')[0]?.AttributeId || 'ProductLength',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'ProductLength',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Length of the product',
    },
    {
      formItemProperties: {
        label: 'Width (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ProductWidth')[0]?.AttributeId || 'ProductWidth',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'ProductWidth',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Width of this product.',
    },
    {
      formItemProperties: {
        label: 'Height (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ProductHeight')[0]?.AttributeId || 'ProductHeight',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'ProductHeight',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Height of this product.',
    },
    {
      formItemProperties: {
        label: 'Box Length (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'BoxLength')[0]?.AttributeId || 'BoxLength',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'BoxLength',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Length of this product (as prepared for shipping).',
    },
    {
      formItemProperties: {
        label: 'Box Width (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'BoxWidth')[0]?.AttributeId || 'BoxWidth',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'BoxWidth',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Width of this product (as prepared for shipping).',
    },
    {
      formItemProperties: {
        label: 'Box Height (inches)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'BoxHeight')[0]?.AttributeId || 'BoxHeight',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'BoxHeight',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Height of this product (as prepared for shipping).',
    },
  ],
  physical2: [
    {
      formItemProperties: {
        label: 'Weight Unit',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'WeightUnit')[0]?.AttributeId || 'WeightUnit',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'WeightUnit',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Weight Unit',
    },
    {
      formItemProperties: {
        label: 'Weight (lb)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'NetWeight')[0]?.AttributeId || 'NetWeight',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'NetWeight',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Weight of this item. (do not include abbreviations such as lbs or oz)',
    },
    {
      formItemProperties: {
        label: 'Gross Weight (lb)',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'GrossWeight')[0]?.AttributeId || 'GrossWeight',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'GrossWeight',
        min: 0.1,
        style: { width: '100%' },
      },
    },
    {
      formItemProperties: {
        label: 'Multipack Quantity',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'MultipackQuantity')[0]?.AttributeId || 'MultipackQuantity',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'MultipackQuantity',
        min: 0.1,
        style: { width: '100%' },
      },
      toolTip: 'Multipack Quantity',
    },
    {
      formItemProperties: {
        label: 'Dimension Unit',
        name: optAttributes.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'DimensionUnit')[0]?.AttributeId || 'DimensionUnit',
      },
      inputType: Type.NUMBER,
      inputProperties: {
        name: 'ProductHeight',
        min: 0,
        max: 2,
        placeholder: '0-in; 1-ft;  2-cm',
        style: { width: '100%' },
      },
      toolTip: '0-in; 1-ft;  2-cm',
    },
  ],
});
