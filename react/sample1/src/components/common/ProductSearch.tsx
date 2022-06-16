import { PlusOutlined } from '@ant-design/icons';
import { TypeColumns } from '@inovua/reactdatagrid-community/types/TypeColumn';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { Button, Col, Image, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { listProductsByType } from '../../services/products';
import { useExecutePromise } from '../../util/hooks';
import { DataGrid } from './datagrid/DataGrid';
import SearchBar from './SearchBar';
import Spacer from './Spacer';
import { ModalTitle } from './styledComponents';

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const defaultColumns = [
  {
    name: 'MediaURL',
    header: 'Image',
    defaultFlex: 1,
    render({ value, data }: { value: string, data: any }) {
      const src = value || 'https://via.placeholder.com/300';

      return (
        <ImageContainer key={data.ProductId}>
          <Image width={28} height={28} src={src} />
        </ImageContainer>
      );
    },
  },
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
  {
    header: 'Type',
    name: 'Type',
    defaultFlex: 1,
  },
  {
    header: 'Brand',
    name: 'Brand',
    defaultFlex: 1,
  },
];

const retrieveProducts = async () => {
  const { ProductList } = await listProductsByType();
  return ProductList;
};

export type ProductProfileMap = {
  [productId: string]: Entities.ProductProfile;
};

export type OnApplyCallback = (selected: ProductProfileMap, available: Entities.ProductProfile[]) => void;

export interface ProductSearchProps {
  onApply?: OnApplyCallback;
  header?: React.ReactNode;
  buttonText?: string;
  buttonIcon?: any;
  data?: any;
  loading?: boolean;
  footer?: React.ReactNode;
  columns?: TypeColumns;
  searchFields?: Array<string>;
  tableIdProperty?: string;
  searchReference?: string;
  defaultSearch?: boolean;
  title?: string;
  allowMultiple?: boolean;
  pagination?: boolean;
  tableStyle?: object;
  searchFieldPlaceholder?: string;
}

const searchFieldsDefault = [
  'ProductTitle',
  'SKU',
  'Brand',
  'Type',
];

const ProductSearchRepresentation: React.FC<ProductSearchProps & { data: Entities.ProductProfile[] }> = (
  {
    onApply,
    buttonText = 'Apply',
    buttonIcon = <PlusOutlined />,
    header,
    data,
    loading,
    footer,
    columns,
    searchFields = searchFieldsDefault,
    tableIdProperty = 'ProductId',
    searchReference = 'ProductId',
    defaultSearch = true,
    allowMultiple = true,
    title = 'Search Products',
    pagination = false,
    tableStyle,
    searchFieldPlaceholder = 'Search',
  },
) => {
  const [filteredData, setFilteredData] = useState<Entities.ProductProfile[]>([]);
  const [currentlySelected, setCurrentlySelected] = useState<any>({});

  const onSelectionChange = useCallback(({ selected }: TypeOnSelectionChangeArg) => setCurrentlySelected(selected), []);

  const onApplyClicked = useCallback(() => {
    onApply?.(currentlySelected, data);
    // Clear selection
    setCurrentlySelected({});
  }, [onApply, data, setCurrentlySelected, currentlySelected]);

  return (
    <div>
      <ModalTitle>
        {title}
      </ModalTitle>
      <Spacer />
      <Row justify="space-between">
        {defaultSearch && (
          <Col xs={24} lg={12}>
            <SearchBar
              reference={searchReference}
              data={data}
              placeholder={searchFieldPlaceholder}
              onResult={setFilteredData}
              fields={searchFields}
            />
          </Col>
        )}
      </Row>
      <Spacer />
      <Row>
        {
        header && (
        <Col span={23}>
          {header}
        </Col>
        )
      }
        <Col span={1} offset={header ? 0 : 23}>
          <Button
            type="primary"
            style={{ float: 'right', marginTop: header ? '50px' : 0 }}
            onClick={onApplyClicked}
            disabled={Object.keys(currentlySelected).length === 0}
          >
            {buttonText}
            {buttonIcon}
          </Button>
        </Col>
      </Row>
      <Spacer />
      <DataGrid
        idProperty={tableIdProperty}
        dataSource={defaultSearch ? filteredData : data}
        columns={columns || defaultColumns}
        loading={loading}
        selected={currentlySelected}
        onSelectionChange={onSelectionChange}
        checkboxColumn={allowMultiple}
        pagination={pagination}
        style={tableStyle}
      />
      {
        footer && (
          <>
            <Spacer />
            {footer}
          </>
        )
      }
    </div>
  );
};

const UncontrolledProductSearch: React.FC<ProductSearchProps> = (props) => {
  const [data, loading] = useExecutePromise<Entities.ProductProfile[]>(retrieveProducts, []);

  return (
    <ProductSearchRepresentation
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      data={data}
      loading={loading}
    />
  );
};

const ProductSearch: React.FC<ProductSearchProps> = ({ data, ...rest }) => {
  if (data === undefined) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <UncontrolledProductSearch {...rest} />;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ProductSearchRepresentation {...rest} data={data} />
  );
};

export default ProductSearch;
