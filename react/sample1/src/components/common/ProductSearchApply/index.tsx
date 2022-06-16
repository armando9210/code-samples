import {
  LinkOutlined, SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Image,
  Select,
  message,
  Card,
  Row,
  Input,
  Radio,
  Space, RadioChangeEvent,
} from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Spacer from '../Spacer';
import { DataGrid } from '../datagrid/DataGrid2';
import {
  GRID_FILTER11,
  GRID_FILTER12,
  GRID_FILTER13,
  GRID_FILTER21,
  filterTypes,
} from '../datagrid/Filter';
import {
  fetchSimpleProductGroup,
  fetchSimpleProductList,
  fetchSimpleProductPartialData,
} from '../../../services/products';
import ClassificationSelector from '../../../screens/ListProducts/ClassificationSelector';
import GroupDetail from '../../../screens/ListProducts/GroupDetail';
import LabelsSelector from '../../../screens/ListProducts/LabelsSelector';
import SortSelector from '../../../screens/ListProducts/SortSelector';
import ChannelControlFlagSelector from '../../../screens/ListProducts/ChannelControlFlagSelector';
import SearchTips from '../SearchTips';

const ExportBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  height: 100%;
`;

type SKULinkProps = {
  product: Entities.ProductProfile;
  target?: string;
};

const SKULink = (props: SKULinkProps) => {
  const { product, target = '_self' } = props;
  const pids = product.ProductId.split('/');
  const productId = pids[pids.length - 1] || '-';

  return (
    <Link target={target} to={`/product-detail/${productId}`}>
      <LinkOutlined />
      &nbsp;
      {product.SKU}
    </Link>
  );
};

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchCol = styled(Col)`
  & .ant-input-group-addon {
    border: solid 1px #d9d9d9 !important;
  }
  & .channel-ctrl-flag-wrapper,
  & .classification-wrapper,
  & .labels-wrapper,
  & .title-wrapper {
    display: inline-block;
  }
  & .channel-ctrl-flag-wrapper {
    width: 453px;
  }
  & .classification-wrapper {
    width: 390px;
  }
  & .labels-wrapper {
    width: 342px;
  }
  & .title-wrapper {
    width: 280px;
  }
  & .channel-ctrl-flag-wrapper .ant-input,
  & .classification-wrapper .ant-input,
  & .labels-wrapper .ant-input {
  }
  & .channel-ctrl-flag-wrapper .ant-select-selector,
  & .classification-wrapper .ant-select-selector,
  & .labels-wrapper .ant-select-selector {
  }
  & .field-label {
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    font-weight: 550;
  }
  & .loading-wrapper {
    display: 'inline-block';
    height: 30px;
    margin: 0;
    padding: 1;
  }
`;

export const columns = [
  {
    name: 'mediaURL',
    header: 'Image',
    defaultFlex: 1,
    defaultLocked: true,
    minWidth: 100,
    maxWidth: 100,
    render({ value, data }: { value: string; data: Entities.ProductProfile }) {
      const src = value || 'https://via.placeholder.com/300';
      const isTreeNode = true;

      return (
        <ImageContainer key={data.ProductId} className={isTreeNode ? 'image-tree-ctn' : ''}>
          <Image width={28} height={28} src={src} />
        </ImageContainer>
      );
    },
  },
  {
    name: 'VariationParentSKU',
    header: 'Style Code',
    defaultFlex: 1,
    minWidth: 120,
    render({ data }: { data: any }) {
      if (data && typeof data === 'object') {
        return data.styleCode || data.VariationParentSKU;
      }

      return '';
    },
  },
  {
    name: 'ProductId',
    header: 'Sub-Style Code',
    defaultFlex: 1,
    minWidth: 180,
    render({ data }: { data: any }) {
      if (data && typeof data === 'object') {
        return data.colorPatternCode || '';
      }

      return '';
    },
  },
  {
    name: 'SKU',
    header: 'SKU',
    defaultFlex: 1,
    minWidth: 150,
    render({ data }: { data: Entities.ProductProfile }) {
      return <SKULink product={data} />;
    },
  },
];

enum ProductTypes {
  PRODUCT = 'Product',
  STYLE = 'Style',
  SUBSTYLE = 'Sub-Style',
}


const ProductSearchApply: React.FC<{ onApply: any }> = ({ onApply }) => {
  const { Option } = Select;
  const CODE_OPTION_STYLE_EQUALS = 1;
  const CODE_OPTION_STYLE_CONTAINS = 2;
  const CODE_OPTION_SKU_EQUALS = 3;
  const CODE_OPTION_SKU_CONTAINS = 4;
  const CODE_OPTION_COLOR_EQUALS = 5;
  const CODE_OPTION_COLOR_CONTAINS = 6;
  const CODE_OPTION_UPC_EQUALS = 7;
  const DEFAULT_GRID_LIMIT = 20;
  const GROUP_OPTION_COLOR = 1;
  const GROUP_OPTION_STYLE = 2;
  const GROUP_OPTION_NO_GROUP = 3;
  const GROUP_OPTION_PRODUCT = 4;
  const OPERATION_CONTAIN = 2;
  const OPERATION_EQUALS = 1;

  const [filteredData, setFilteredData] = useState<Entities.ProductProfile[]>([]);
  const [stateColumns] = useState<any>(columns);
  const [inited, setInited] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pageSkip, setPageSkip] = useState(0);
  const [pageTop, setPageTop] = useState(DEFAULT_GRID_LIMIT);
  const [searchCCFs, setSearchCCFs] = useState<any[]>([]);
  const [searchCFs, setSearchCFs] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [searchCodeType, setSearchCodeType] = useState(CODE_OPTION_STYLE_CONTAINS);
  const [searchMore, setSearchMore] = useState(false);
  const [searchTreeMode, setSearchTreeMode] = useState(false);
  const [searchGroup, setSearchGroup] = useState(GROUP_OPTION_COLOR);
  const [searchGroupMode, setSearchGroupMode] = useState(false);
  const [disableFilterProductByType, setDisableFilterProductByType] = useState(false);
  const [searchBrand, setSearchBrand] = useState<string>();
  const [searchLabels, setSearchLabels] = useState<any[]>([]);
  const [searchSorter, setSearchSorter] = useState<string>();
  const [searchTitle, setSearchTitle] = useState('');
  const [filterProductsByType, setFilterProductsByType] = useState(ProductTypes.SUBSTYLE);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = React.useState<any>({});
  const codeInputRef = React.useRef<any>(null);
  const searchMoreStyle = useMemo(() => ({
    display: searchMore ? '' : 'none',
  }), [searchMore]);

  const searchCodeTypeSelector = () => (
    <Select
      className="select-after"
      defaultValue={searchCodeType}
      onChange={onSelectSearchCodeType}
      style={{ width: 230 }}
    >
      <Option value={CODE_OPTION_STYLE_EQUALS}>Style Code Equals</Option>
      <Option value={CODE_OPTION_STYLE_CONTAINS}>Style Code Contains</Option>
      <Option value={CODE_OPTION_SKU_EQUALS}>SKU Equals</Option>
      <Option value={CODE_OPTION_SKU_CONTAINS}>SKU Contains</Option>
      <Option value={CODE_OPTION_COLOR_EQUALS}>Color/Pattern Code Equals</Option>
      <Option value={CODE_OPTION_COLOR_CONTAINS}>Color/Pattern Code Contains</Option>
      <Option value={CODE_OPTION_UPC_EQUALS}>UPC Equals</Option>
    </Select>
  );
  const filterValue = [
    { name: 'SKU', operator: 'contains', type: GRID_FILTER13, value: '' },
    {
      name: 'ProductTitle',
      operator: 'contains',
      type: GRID_FILTER11,
      value: '',
    },
    { name: 'UPC', operator: 'eq', type: GRID_FILTER12, value: '' },
    { name: 'QtyTotal', operator: 'gte', type: GRID_FILTER21, value: null },
  ];
  const gridFilterTypes = {
    styleCodeFilter: {
      type: 'string',
      emptyValue: '',
      operators: [
        { name: 'SKU Contains', fn: () => true },
        { name: 'SKU Equals', fn: () => true },
      ],
    },
    ...filterTypes,
  };

  const dataSource = async (): Promise<{ data: any[]; count: number }> => ({
    data: filteredData.filter(f => f.Type === filterProductsByType),
    count: totalCount,
  });

  // eslint-disable-next-line
  const fetchProductList = async (options: StringKAnyVPair = {}) => {
    const { skip, top } = options;
    setSelected({});

    setIsFetching(true);

    try {
      const { ProductList, ProductTotalCount } = await fetchSimpleProductList(
        typeof skip === 'number' && skip >= 0 ? skip : pageSkip,
        typeof top === 'number' && top >= 0 ? top : pageTop,
        getSearchOptions(),
      );

      if (Array.isArray(ProductList)) {
        if (isSearchGroupMode(searchCodeType)) {
          ProductList.forEach((e) => {
            if (['Product', 'Bundle'].indexOf(e.Type) < 0) {
              e.nodes = null;
            }
          });
        }

        setFilteredData(ProductList);
        setTotalCount(ProductTotalCount || ProductList.length);
        // do not use the row detail feature to show product children
        // setSearchGroupMode(isSearchGroupMode(searchCodeType));
        setSearchGroupMode(false);
        setSearchTreeMode(isSearchGroupMode(searchCodeType));

        if (ProductList.length > 0) {
          setTimeout(async () => {
            await fetchProductParticalData(ProductList);
            setFilteredData([...ProductList]);
          }, 0);
        } else {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
      }
    } catch (e) {
      setIsFetching(false);
      setFilteredData([]);
      setTotalCount(0);
      message.error(`Fetch products error: ${e}`);
      console.log('Fetch products error:', e);
    } finally {
    }
  };

  const fetchProductParticalData = async (products: StringKAnyVPair[]) => {
    setIsFetching(true);

    try {
      const pDict: StringKAnyVPair = {};
      const ids = products.map((e) => {
        pDict[e.ProductId] = e;

        return e.ProductId;
      });
      const data = await fetchSimpleProductPartialData(ids);

      if (data && Array.isArray(data)) {
        data.forEach((e) => {
          if (pDict[e.productId]) {
            const obj = { ...e };

            for (const k in obj) {
              pDict[e.productId][k] = obj[k];
            }
          }
        });
      }
    } catch (e) {
      message.error(`Fetch partial error: ${e}`);
      console.error('Fetch partial error:', e);
    } finally {
      setIsFetching(false);
    }
  };

  const getFilterNameBySearchCodeType = () => {
    switch (searchCodeType) {
      case CODE_OPTION_COLOR_CONTAINS:
      case CODE_OPTION_COLOR_EQUALS:
        return 'ColorPatternCode';

      case CODE_OPTION_SKU_CONTAINS:
      case CODE_OPTION_SKU_EQUALS:
        return 'SKU';

      case CODE_OPTION_STYLE_CONTAINS:
      case CODE_OPTION_STYLE_EQUALS:
        return 'StyleCode';

      case CODE_OPTION_UPC_EQUALS:
        return 'UPC';
    }
  };

  const getOperateCodeBySearchCodeType = () => {
    switch (searchCodeType) {
      case CODE_OPTION_COLOR_CONTAINS:
      case CODE_OPTION_SKU_CONTAINS:
      case CODE_OPTION_STYLE_CONTAINS:
        return OPERATION_CONTAIN;

      case CODE_OPTION_COLOR_EQUALS:
      case CODE_OPTION_SKU_EQUALS:
      case CODE_OPTION_STYLE_EQUALS:
      case CODE_OPTION_UPC_EQUALS:
        return OPERATION_EQUALS;
    }
  };

  const getSearchGrouper = (/* filters: any[] */) => {
    let ret: any = null;

    if (isCommonGroupOption(searchCodeType) || isSKUCode(searchCodeType)) {
      let groupName = '';

      switch (searchGroup) {
        case GROUP_OPTION_COLOR:
          groupName = 'ColorPatternCode';
          break;

        case GROUP_OPTION_PRODUCT:
          groupName = 'Product';
          break;

        case GROUP_OPTION_STYLE:
          groupName = 'StyleCode';
          break;
      }

      if (groupName) {
        ret = { groupName };
      }
    }

    return ret;
  };

  const getSearchOptions = () => {
    const filters: StringKAnyVPair[] = [];

    // if (searchCode) {
    filters.push({
      filterName: getFilterNameBySearchCodeType(),
      filterValue: searchCode,
      op: getOperateCodeBySearchCodeType(),
    });
    // }

    if (searchTitle) {
      filters.push({
        filterName: 'ProductTitle',
        filterValue: searchTitle,
        op: OPERATION_CONTAIN,
      });
    }

    if (searchCCFs.length > 0) {
      filters.push({
        filterName: 'ChannelControlFlag',
        filterValue: searchCCFs.join('|'),
        op: OPERATION_EQUALS,
      });
    }

    if (searchCFs.length > 0) {
      filters.push({
        filterName: 'Classification',
        filterValue: searchCFs.join('|'),
        op: OPERATION_EQUALS,
      });
    }

    if (searchLabels.length > 0) {
      filters.push({
        filterName: 'Labels',
        filterValue: searchLabels.join('|'),
        op: OPERATION_EQUALS,
      });
    }

    if (searchBrand) {
      filters.push({
        filterName: 'Brand',
        filterValue: searchBrand,
        op: OPERATION_EQUALS,
      });
    }

    return {
      queryFilters: filters,
      queryGrouper: getSearchGrouper(),
      querySorters: getSearchSorter(),
    };
  };

  const getSearchSorter = () => {
    const ret: any[] = [];

    if (searchSorter) {
      const fields = searchSorter.split(' ');

      if (fields.length === 2) {
        ret.push({
          sortByName: fields[0],
          sortOps: fields[1],
        });
      }
    }

    return ret;
  };

  const handleSearchProducts = () => {
    setInited(true);
    fetchProductList();
  };

  const isColorCode = (code: number) => [CODE_OPTION_COLOR_CONTAINS, CODE_OPTION_COLOR_EQUALS].indexOf(code) > -1;

  const isCommonGroupOption = (code: number) => isColorCode(code) || isStyleCode(code);

  const isSearchGroupMode = (code: number) => isCommonGroupOption(code) && searchGroup !== GROUP_OPTION_NO_GROUP;

  const isSKUCode = (code: number) => [CODE_OPTION_SKU_CONTAINS, CODE_OPTION_SKU_EQUALS].indexOf(code) > -1;

  const isStyleCode = (code: number) => [CODE_OPTION_STYLE_CONTAINS, CODE_OPTION_STYLE_EQUALS].indexOf(code) > -1;

  const gridColumns = (isGroupMode = false) => {
    const colDef = [...stateColumns];

    for (let i = 0; i < colDef.length; i++) {
      if (colDef[i].header === 'Image') {
        colDef[i].render = (p: any) => {
          const { value, data } = p;
          const src = value || 'https://via.placeholder.com/300';
          const isTreeNode = isGroupMode;

          return (
            <ImageContainer key={data.ProductId} className={isTreeNode ? 'image-tree-ctn' : ''}>
              <Image width={28} height={28} src={src} />
            </ImageContainer>
          );
        };
      } else if (colDef[i].header === 'SKU') {
        colDef[i].render = (p: any) => {
          const { data } = p;

          return data.SKU;
        };
      }
    }

    return colDef;
  };

  const loadNextLevelProducts = async (data: any) => {
    const { node } = data;
    let ret: any = null;

    try {
      const { ProductList } = await fetchSimpleProductGroup(node.ProductId);

      if (Array.isArray(ProductList)) {
        if (ProductList.length > 0) {
          await fetchProductParticalData(ProductList);
        }

        ret = ProductList;
      }
    } finally {
    }

    return ret;
  };

  const onFilterValueChange = (val: any) => {
    // console.log('vv->', val);
  };

  const onGroupModeChange = (val: any) => {
    setSearchGroup(val.target.value);
  };

  const onLimitChange = (limit: number) => {
    // console.log('limit -->', limit);
    fetchProductList({ top: limit });
    setPageTop(limit);
  };

  const onSelectChannelControlFlags = (values: any[]) => {
    // console.log('v-->', values);
    setSearchCCFs(values);
  };

  const onSelectClassifications = (values: any[]) => {
    // console.log('v-->', values);
    setSearchCFs(values);
  };

  const onSelectLabels = (values: any[]) => {
    // console.log('v-->', values);
    setSearchLabels(values);
  };

  const onSelectSortType = (value: any) => {
    // console.log('-->', value);
    setSearchSorter(value);
  };

  const onSearchCodeChange = (evt: any) => {
    // console.log('-->', evt.target.value);
    // setSearchCode(evt.target.value as string);
    const value = evt.target.value as string;

    setTimeout(() => setSearchCode(value), 0);
  };

  const onSearchTitleChange = (evt: any) => {
    const value = evt.target.value as string;

    setTimeout(() => setSearchTitle(value), 0);
  };

  const onSelectSearchCodeType = (value: any) => {
    switch (value) {
      case CODE_OPTION_COLOR_CONTAINS:
      case CODE_OPTION_COLOR_EQUALS:
      case CODE_OPTION_STYLE_CONTAINS:
      case CODE_OPTION_STYLE_EQUALS:
        setSearchGroup(GROUP_OPTION_COLOR);
        break;

      case CODE_OPTION_SKU_CONTAINS:
      case CODE_OPTION_SKU_EQUALS:
        setSearchGroup(GROUP_OPTION_NO_GROUP);
        break;
    }

    setSearchCodeType(value);
    codeInputRef?.current?.select();
    codeInputRef?.current?.focus();
  };

  const onSelectionChange = useCallback((props) => {
    const { selected, data, unselected } = props;
    setSelected(selected);
    if (selected === true && !unselected) {
      setSelectedRows(data as any);
    } else if (!unselected) {
      setSelectedRows(Object.values(selected as any));
    } else {
      setSelectedRows((prev) => prev.filter((item) => item.ProductId !== (data as any).id));
    }
  }, []);

  const onSkipChange = (skip: number) => {
    // console.log('skip -->', skip);
    fetchProductList({ skip });
    setPageSkip(skip);
  };

  const onSortChange = async () => {
    // console.log('-->', info);
  };

  const renderRowDetails = (param: any) => {
    const { data } = param;
    // console.log('p ->', data, param);
    return <GroupDetail row={data} />;
  };

  const handleApply = () => {
    onApply(selectedRows);
    setDisableFilterProductByType(true);
  };

  const handleFilterProductByType = (e: RadioChangeEvent) => {
    setFilterProductsByType(e.target.value);
  };

  return (
    <>
      <Card size="small" style={{ width: '100%' }}>
        <Row justify="space-between">
          <SearchCol xs={24} lg={12}>
            <Space direction="vertical">
              <Space>
                <Input
                  addonBefore={searchCodeTypeSelector()}
                  allowClear
                  onChange={onSearchCodeChange}
                  ref={codeInputRef}
                  style={{ width: 380 }}
                />
                <span className="field-label" style={{ paddingRight: 0 }}>
                  Display:
                </span>
                <Radio.Group
                  onChange={onGroupModeChange}
                  style={{ width: 430 }}
                  value={searchGroup}
                >
                  <Radio disabled={!isStyleCode(searchCodeType)} value={GROUP_OPTION_STYLE}>
                    Style Master
                  </Radio>
                  <Radio
                    disabled={!isCommonGroupOption(searchCodeType)}
                    value={GROUP_OPTION_COLOR}
                  >
                    Sub-Style
                  </Radio>
                  <Radio
                    disabled={!isCommonGroupOption(searchCodeType)}
                    value={GROUP_OPTION_PRODUCT}
                  >
                    Product
                  </Radio>
                </Radio.Group>
              </Space>
              <Space style={searchMoreStyle}>
                <div className="title-wrapper">
                  <span className="field-label">Title:</span>
                  <Input allowClear onChange={onSearchTitleChange} style={{ width: 200 }} />
                </div>
                <div className="channel-ctrl-flag-wrapper">
                  <span className="field-label">Channel Control Flag:</span>
                  <ChannelControlFlagSelector
                    onChange={onSelectChannelControlFlags}
                    style={{ width: 290 }}
                  />
                </div>
              </Space>
              <Space style={searchMoreStyle}>
                <div className="classification-wrapper">
                  <span className="field-label">Classification:</span>
                  <ClassificationSelector
                    onChange={onSelectClassifications}
                    style={{ width: 200 }}
                  />
                </div>
                <div className="labels-wrapper">
                  <span className="field-label">Labels:</span>
                  <LabelsSelector onChange={onSelectLabels} style={{ width: 200 }} />
                </div>
                <div className="labels-wrapper">
                  <span className="field-label">Brand:</span>
                  <Input
                    onChange={(e) => setSearchBrand(e.target.value)}
                    style={{ width: 200 }}
                  />
                </div>
              </Space>

              <Row
                align="middle"
                justify="space-between"
                style={{ width: 740, marginTop: searchMore ? 0 : -16 }}
              >
                <Space>
                  <Button onClick={() => setSearchMore((prev) => !prev)} type="link">
                    {searchMore ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                  </Button>
                </Space>
                <Space>
                  <div className="title-wrapper">
                    <span className="field-label">Sort By:</span>
                    <SortSelector onChange={onSelectSortType} style={{ width: 208 }} />
                  </div>
                  <Button type="primary" onClick={handleSearchProducts}>
                    Search
                    <SearchOutlined />
                  </Button>
                </Space>
              </Row>
            </Space>
          </SearchCol>
          <Col>
            <ExportBar>
              {filteredData.length > 0 && (
                <Button onClick={handleApply}>
                  Apply
                </Button>
              )}
            </ExportBar>
          </Col>
        </Row>
      </Card>
      {inited ? <Spacer height={14} /> : <SearchTips />}

      {inited && (
        <Card size="small" style={{ flexGrow: 1 }} bodyStyle={{ height: '100%' }}>
          <Row>
            <Col span={8} offset={16} style={{ textAlign: 'right' }}>
              <Radio.Group name="productTypeFilter" disabled={disableFilterProductByType} defaultValue={ProductTypes.SUBSTYLE} onChange={handleFilterProductByType} value={filterProductsByType}>
                <Radio value={ProductTypes.PRODUCT}>Product</Radio>
                <Radio value={ProductTypes.STYLE}>Style</Radio>
                <Radio value={ProductTypes.SUBSTYLE}>Sub-Style</Radio>
              </Radio.Group>
            </Col>
            <Col span={24}>
              <DataGrid
                style={{ minHeight: '800px' }}
                idProperty="ProductId"
                rowHeight={35}
                columns={gridColumns(searchTreeMode)}
                dataSource={dataSource}
                defaultFilterValue={filterValue}
                defaultLimit={DEFAULT_GRID_LIMIT}
                enableFiltering={false}
                filterTypes={gridFilterTypes}
                limit={pageTop}
                loadNode={loadNextLevelProducts}
                loading={isFetching}
                onFilterValueChange={onFilterValueChange}
                onLimitChange={onLimitChange}
                onSelectionChange={onSelectionChange}
                onSkipChange={onSkipChange}
                onSortInfoChange={onSortChange}
                pageSizes={[20, 30, 50, 100, 200]}
                pagination
                renderRowDetails={renderRowDetails}
                rowExpandColumn={searchGroupMode}
                rowExpandHeight={300}
                // selected={selectedRows}
                skip={pageSkip}
                sortable={false}
                treeColumn={searchTreeMode ? 'mediaURL' : undefined}
                checkboxColumn
                selected={selected}
              />
            </Col>
          </Row>
        </Card>
      )}
    </>
  )
  ;
};

export default ProductSearchApply;
