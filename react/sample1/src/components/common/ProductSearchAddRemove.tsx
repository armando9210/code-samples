import { PlusOutlined } from '@ant-design/icons';
import { TypeColumns } from '@inovua/reactdatagrid-community/types/TypeColumn';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { Button, Col, Form, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSimpleProductsQuery } from '../../redux/api/products';
import { objectToArray } from '../../util';
import { DataGrid } from './datagrid/DataGrid';
import ProductSearch, { ProductProfileMap, ProductSearchProps } from './ProductSearch';
import Spacer from './Spacer';
import { ModalTitle } from './styledComponents';

const defaultColumns = [
  {
    header: 'SKU',
    name: 'SKU',
    defaultFlex: 1,
  },
  {
    header: 'Title',
    name: 'ProductTitle',
    defaultFlex: 3,
  },
];

export const ColFilter = styled(Col)`
  padding-right: 15px;
`;

interface SelectedProductsProps {
  data: Entities.ProductProfile[];
  columns?: TypeColumns;
  onRemove: Function;
  tableStyle?: object;
}

const SelectedProducts: React.FC<SelectedProductsProps> = (
  {
    data,
    columns,
    onRemove,
    tableStyle,
  },
) => {
  const [currentlySelected, setCurrentlySelected] = useState<ProductProfileMap>({});
  const onSelectionChange = useCallback(({ selected }: TypeOnSelectionChangeArg) => {
    setCurrentlySelected(selected as ProductProfileMap);
  }, []);

  const onApplyClicked = useCallback(() => {
    const newData = [...data];
    objectToArray(currentlySelected)
      .map((item: Entities.ProductProfile) => newData.splice(newData.indexOf(item), 1));
    onRemove?.(newData);
    setCurrentlySelected({});
  }, [currentlySelected, data, onRemove]);

  return (
    <>
      <Spacer />
      <Row>
        <Col span={12}>
          <ModalTitle>
            Selected products
          </ModalTitle>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            style={{ float: 'right' }}
            onClick={onApplyClicked}
            disabled={Object.keys(currentlySelected).length === 0}
          >
            Remove products
            <PlusOutlined />
          </Button>
        </Col>
      </Row>
      <Spacer />
      <DataGrid<Entities.ProductProfile>
        idProperty="ProductId"
        dataSource={data}
        columns={columns || defaultColumns}
        checkboxColumn
        selected={currentlySelected}
        onSelectionChange={onSelectionChange}
        style={tableStyle}
      />
    </>
  );
};

interface ProductSearchAddRemoveProps extends Omit<ProductSearchProps, 'onApply'> {
  onChangeSelected: (selected: Entities.ProductProfile[], available: Entities.ProductProfile[]) => void;
  tableStyle?: object;
  query?: any;
  channelAccountNum?: number;
  channelNum?: number;
  styleMaster?: boolean;
}

const ProductSearchAddRemove: React.FC<ProductSearchAddRemoveProps> = ({ onChangeSelected, tableStyle, query = useSimpleProductsQuery, channelAccountNum, channelNum, styleMaster = false, ...productSearchProps }) => {
  const {
    data = { ProductTotalCount: 0, ProductList: [] },
    isFetching,
  } = query(channelAccountNum ? { channelAccountNum, channelNum } : {});
  const dataFormatted = styleMaster ? data.ProductList.filter((f: Entities.ProductChannelAccount) => f.Type === 'StyleMaster') : data.ProductList;
  const [selected, setSelected] = useState<Entities.ProductProfile[]>([]);
  const [form] = Form.useForm();
  form.setFieldsValue({
    FilterList: [
      {
        ParameterValue: '',
      },
    ],
  });
  const add = useCallback((selectedParam: ProductProfileMap) => {
    const newSelected = selected
      .concat(objectToArray(selectedParam) as Entities.ProductProfile[])
      .filter((item, index, values) => values.findIndex((t: any) => t.SKU === item.SKU) === index);
    setSelected(newSelected);
    onChangeSelected(newSelected, dataFormatted);
  }, [onChangeSelected, selected, dataFormatted]);

  const remove = useCallback((newData: Entities.ProductProfile[]) => {
    const newSelected = newData;
    setSelected(newSelected as any);
    onChangeSelected(newSelected, dataFormatted);
  }, [onChangeSelected, dataFormatted]);

  return (
    <Form form={form}>
      <ProductSearch
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...productSearchProps}
        data={dataFormatted}
        loading={isFetching}
        searchFieldPlaceholder="SKU, Title, Type, Brand..."
        tableStyle={tableStyle}
        onApply={add}
        footer={(
          <SelectedProducts
            data={selected}
            columns={productSearchProps.columns}
            onRemove={remove}
            tableStyle={tableStyle}
          />
        )}
      />
    </Form>
  );
};

export default ProductSearchAddRemove;
