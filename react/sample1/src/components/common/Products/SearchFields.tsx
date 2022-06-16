import React from 'react';
import { Form, Input, Select } from 'antd';
import { useSelector } from 'react-redux';
import { NamePath } from 'antd/es/form/interface';
import { useGetAttributesQuery, useGetClassificationsQuery } from '../../../redux/api/productElements';
import { OPTFilterCategory } from '../../../types/enums';
import { useGetPlatformsQuery } from '../../../redux/api/account';
import FormItemEnabler from '../../../screens/ProductBulkUpdate/FormItemEnabler';
import FormElement, { Type } from '../FormElement';

interface ClassificationFilterFieldProps {
  formLabelVertical?: boolean,
  enabler?: boolean,
  readOnly?: boolean,
  name?: NamePath,
  onCheckChange?: Function,
}

export const ClassificationFilterField: React.FC<ClassificationFilterFieldProps> = ({
  formLabelVertical = true,
  enabler = false,
  readOnly = false,
  name =  ['FilterList', 0, 'ParameterValue'],
  onCheckChange,
}) => {
  const { data = [], isFetching } = useGetClassificationsQuery();
  const InputClass = enabler ? FormItemEnabler : FormElement;
  const cols = formLabelVertical ? { span: 24 } : { span: 12 };

  return (
    <div>
      <InputClass
        inputType={Type.SELECT}
        formItemProperties={{
          label: 'Classification',
          name,
          labelCol: cols,
          wrapperCol: cols,
        }}
        inputProperties={{
          loading: isFetching,
          style: { minWidth: '150px' },
          disabled: readOnly,
          bordered: !readOnly,
          showArrow: !readOnly,
          allowClear: true,
          options: data.map((c: Entities.ProductClassification) => ({
            label: c.ClassificationName,
            value: c.ClassificationNum,
            key: c.ClassificationId,
          })),
        }}
        onCheckChange={onCheckChange}
      />
    </div>
  );
};

export const ChannelField: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { data = [], isFetching } = useGetPlatformsQuery();

  return (
    <div>
      <Form.Item
        label="Channel"
        name={['FilterList', 1, 'ParameterValue']}
        style={{ minWidth: '150px' }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          allowClear
          loading={isFetching}
          disabled={readOnly}
          bordered={!readOnly}
          showArrow={!readOnly}
        >
          {data.map(d => (
            <Select.Option key={d.ChannelNum} value={d.ChannelNum || d.PlatformNum}>
              {d.ChannelName || d.PlatformNum}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['FilterList', 1, 'ParameterName']}
        hidden
        noStyle
        initialValue={OPTFilterCategory.CHANNEL}
      >
        <Input hidden />
      </Form.Item>
    </div>
  );
};

export const AttributesField: React.FC<{ readOnly?: boolean }> = (
  {
    readOnly = false,
  },
) => {
  const { data = [], isFetching } = useGetAttributesQuery();

  return (
    <div>
      <Form.Item
        label="Attributes"
        name={['FilterList', 2, 'ParameterValue']}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          loading={isFetching}
          style={{ minWidth: '180px', maxWidth: '300px' }}
          mode="tags"
          allowClear
          disabled={readOnly}
          bordered={!readOnly}
          showArrow={!readOnly}
        >
          {data.map((d: Entities.ProductAttribute) => {
            if (!d.AttributeNum) {
              return null;
            }

            return (
              <Select.Option key={d.AttributeId} value={d.AttributeNum.toString()}>
                {d.AttributeName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </div>
  );
};

export const LabelsField: React.FC<{ readOnly?: boolean }> = (
  {
    readOnly = false,
  },
) => {
  const data = useSelector((state: any) => state.productsBulkUpdate.labels);

  return (
    <div>
      <Form.Item
        label="Labels"
        name={['FilterList', 6, 'ParameterValue']}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          loading={false}
          style={{ minWidth: '180px', maxWidth: '300px' }}
          mode="tags"
          allowClear
          disabled={readOnly}
          bordered={!readOnly}
          showArrow={!readOnly}
        >
          {data.map((d: Entities.ILabel) => {
            if (!d.ProductLabelId) {
              return null;
            }

            return (
              <Select.Option key={d.ProductLabelId} value={d.ProductLabelId.toString()}>
                {d.ProductLabelName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </div>
  );
};


export const BrandField: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => (
  <Form.Item
    label="Brand"
    name={['FilterList', 4, 'ParameterValue']}
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
  >
    <Input
      style={{ minWidth: '150px' }}
      disabled={readOnly}
      type="text"
    />
  </Form.Item>
);

export const ManufacturerField: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => (
  <Form.Item
    label="Manufacturer"
    name={['FilterList', 5, 'ParameterValue']}
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
  >
    <Input
      style={{ minWidth: '150px' }}
      disabled={readOnly}
      type="text"
    />
  </Form.Item>
);
