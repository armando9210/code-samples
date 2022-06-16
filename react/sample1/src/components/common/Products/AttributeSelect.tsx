import React from 'react';
import { Select, SelectProps } from 'antd';
import { useGetAttributesQuery } from '../../../redux/api/productElements';

interface AttributeSelectProps extends SelectProps<number> {
  data?: Entities.ProductAttribute[];
}

const AttributeSelect: React.FC<AttributeSelectProps> = ({ data, ...selectProps }) => {
  const filterOption = (input: string, option: any): boolean => option.children.toLowerCase().indexOf(input) >= 0;

  return (
    <Select
      showSearch
      filterOption={filterOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...selectProps}
    >
      {data?.map(attribute => {
        if (!attribute.AttributeNum) {
          return null;
        }

        return (
          <Select.Option
            key={attribute.AttributeNum}
            value={attribute.AttributeNum.toString()}
          >
            {attribute.AttributeName}
          </Select.Option>
        );
      })}
    </Select>
  );
};

const AttributesSelectRemoteData: React.FC<SelectProps<number>> = (selectProps) => {
  const { data = [], isLoading } = useGetAttributesQuery();

  return (
    <AttributeSelect
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...selectProps}
      loading={isLoading}
      data={data}
    />
  );
};

export default AttributesSelectRemoteData;
