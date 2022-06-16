import ReactDataGrid from '@inovua/reactdatagrid-community';
import {
  TypeColumn,
  TypeDataGridProps,
  TypeRowSelection,
  TypeFilterTypes,
  TypeFilterValue,
} from '@inovua/reactdatagrid-community/types';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import React, { useEffect, useRef, useState } from 'react';

export type TypeActionsColumn<T> = TypeColumn & {
  /**
   * When the user clicks on the Edit button, this is the field that will be
   * specified.
   *
   * If not specified, it'll default to column's first item `name` or `columnId`
   */
  focusField?: string;
  editDisabled?: ((record: T) => boolean) | boolean;
  deleteDisabled?: ((record: T) => boolean) | boolean;
};

interface DataGridProps<T> {
  /**
   * Attributes for the column that renders actions such as Edit/Delete Save/Cancel
   *
   * This column has the same object definition as a regular `ReactDataGrid` column,
   * with the extra attributes:
   * - focusField: used to indicate the first field to be focused when on edit mode.
   * If not provided, the first column defined will be used. A valid value must be the
   * column's name property
   * - editDisabled: used to disable the edit button.
   * - deleteDisabled: used to disable the edit button.
   */
  count?: number;
  defaultLimit?: number;
  editableDefault?: boolean;
  filterTypes?: TypeFilterTypes;

  // ReactDataGrid attributes.
  //  Original types flags all attributes as required, which they're not.
  //  So for now, manually overriding here as they're needed.

  dataSource: any[];
  columns: TypeColumn[];
  onFilterValueChange?: (filterValue: TypeFilterValue) => void;
  idProperty?: string;
  style?: any;
  rowHeight?: any;
  loading?: boolean;
  editable?: boolean;
  pagination?: any;
  checkboxColumn?: boolean;
  selected?: TypeRowSelection;
  onLimitChange?: (skip: number) => void;
  onSelectionChange?: (config: TypeOnSelectionChangeArg) => void;
  onSkipChange?: (skip: number) => void;
  defaultFilterValue?: TypeFilterValue;
  reactDataGridProps?: TypeDataGridProps;
  sortable?: boolean;
  totalDataCount?: number;
  otherButtons?: string[];
  onclickOtherButton?: (key: string, data: T) => void;
}

function DataGrid<T>({
  columns,
  dataSource,
  editableDefault = false,
  style,
  reactDataGridProps,
  otherButtons,
  onclickOtherButton,
  ...props
}: DataGridProps<T>) {
  const [localDataSource, setLocalData] = useState(dataSource);
  const editItem = useRef<T | null>(null);

  // Refresh the local data whenever the dataSource changes
  useEffect(() => {
    setLocalData(dataSource);
    editItem.current = null;
  }, [dataSource]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <ReactDataGrid
      style={style}
      dataSource={localDataSource}
      {...reactDataGridProps}
      {...props}
      columns={columns}
    />
  );
  /* eslint-enable */
}

DataGrid.defaultProps = {
  actionsColumn: undefined,
  idProperty: undefined,
  rowHeight: undefined,
  loading: undefined,
  editable: undefined,
  pagination: undefined,
  checkboxColumn: undefined,
  selected: undefined,
  onSelectionChange: undefined,
  defaultFilterValue: undefined,
  reactDataGridProps: {
    showColumnMenuLockOptions: false,
  },
};

export { DataGrid };
