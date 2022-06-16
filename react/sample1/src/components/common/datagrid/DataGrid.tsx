import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { TypeColumn, TypeDataGridProps, TypeEditInfo, TypeRowSelection, TypeFilterTypes, TypeFilterValue } from '@inovua/reactdatagrid-community/types';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { Button, Col, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type TypeActionsColumn<T> = TypeColumn & {
  /**
   * When the user clicks on the Edit button, this is the field that will be
   * specified.
   *
   * If not specified, it'll default to column's first item `name` or `columnId`
   */
  focusField?: string,
  editDisabled?: ((record: T) => boolean) | boolean;
  deleteDisabled?: ((record: T) => boolean) | boolean;
};

interface ActionsCellProps<T> {
  rowIndex: number;
  record: T;
  gridRef: React.MutableRefObject<any> | null;
  fieldFocusId: string;
  /**
   * Use this function to specify custom code to run when the user clicks
   * the edit button.
   *
   * The function receives the object
   */
  onEdit?: (row: T) => void;
  onCancel?: () => void;
  onSave?: (data: T, rowIndex: number) => void;
  onDelete?: (data: T, rowIndex: number) => void;
  editDisabled?: ((record: T) => boolean) | boolean;
  deleteDisabled?: ((record: T) => boolean) | boolean;
}

export function ActionsCell<T>(
  {
    record,
    onSave,
    onEdit,
    onDelete,
    onCancel,
    rowIndex,
    fieldFocusId,
    gridRef,
    editDisabled,
    deleteDisabled,
  }: ActionsCellProps<T>,
) {
  const isEditing = (record as unknown as { $dirty: boolean })?.$dirty;
  const disableEdit = useMemo(() => {
    if (typeof editDisabled === 'function') return editDisabled(record);
    return editDisabled;
  }, [editDisabled, record]);
  const disableDelete = useMemo(() => {
    if (typeof deleteDisabled === 'function') return deleteDisabled(record);
    return deleteDisabled;
  }, [deleteDisabled, record]);

  return (
    <Row justify="end" gutter={14}>
      <Col>
        {
          isEditing ?
            (
              <Button
                size="small"
                onClick={() => {
                  if (!onSave) return;

                  const value: any = { ...record };
                  delete value.$dirty;

                  onSave(value, rowIndex);
                }}
              >
                Save
                <CheckOutlined style={{ color: '#02a800' }} />
              </Button>
            ) :
            (
              <Button
                size="small"
                onClick={() => {
                  if (onEdit) {
                    onEdit(record);
                  } else {
                    gridRef?.current?.startEdit({ rowIndex, columnId: fieldFocusId });
                  }
                }}
                disabled={disableEdit}
              >
                Edit
                <EditOutlined style={{ color: '#006dff' }} />
              </Button>
            )
        }
      </Col>
      <Col>
        {
          isEditing ?
            (
              <Button
                size="small"
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    gridRef?.current?.cancelEdit();
                  }
                }}
              >
                Cancel
                <CloseOutlined style={{ color: '#2d3f5d' }} />
              </Button>
            ) :
            (
              <Button
                size="small"
                onClick={() => {
                  if (!onDelete) {
                    return;
                  }

                  onDelete(record, rowIndex);
                }}
                disabled={disableDelete}
              >
                Delete
                <DeleteOutlined style={{ color: '#c13939' }} />
              </Button>
            )
        }
      </Col>
    </Row>
  );
}

ActionsCell.defaultProps = {
  onSave: undefined,
  onDelete: undefined,
  onCancel: undefined,
  onEdit: undefined,
  editDisabled: false,
  deleteDisabled: false,
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
  actionsColumn?: TypeActionsColumn<T>;
  count?: number;
  onDelete?: (data: T, rowIndex: number) => void;
  onSave?: (data: T, rowIndex: number) => void;
  defaultLimit?: number;
  editableDefault?: boolean;
  filterTypes?: TypeFilterTypes;
  inlineEdit?: boolean;
  onEdit?: (row: T) => void;

  // ReactDataGrid attributes.
  //  Original types flags all attributes as required, which they're not.
  //  So for now, manually overriding here as they're needed.

  dataSource: any[];
  columns: TypeColumn[];
  onEditStart?: (editInfo: TypeEditInfo) => void;
  onEditComplete?: (editInfo: TypeEditInfo, dirty: boolean) => void;
  onEditCancel?: (editInfo: TypeEditInfo, dirty: boolean) => void;
  onFilterValueChange?: (filterValue: TypeFilterValue) => void;
  onReady?: (ref: React.MutableRefObject<any>) => void;
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
}


function DataGrid<T>(
  {
    columns,
    actionsColumn,
    dataSource,
    onEdit,
    onEditStart,
    onEditCancel,
    onEditComplete,
    onSave,
    onDelete,
    onReady,
    editableDefault = false,
    inlineEdit = true,
    style,
    reactDataGridProps,
    ...props
  }: DataGridProps<T>,
) {
  const [localDataSource, setLocalData] = useState(dataSource);
  const [gridRef, setGridRef] = useState<React.MutableRefObject<any> | null>(null);
  const editItem = useRef<T | null>(null);
  const prevEditInfo = useRef<TypeEditInfo | null>(null);
  const currentEditInfo = useRef<TypeEditInfo | null>(null);

  const targetCol: string = useMemo(() => actionsColumn?.focusField || columns[0].name || '', [actionsColumn, columns]);

  // Refresh the local data whenever the dataSource changes
  useEffect(() => {
    setLocalData(dataSource);
    editItem.current = null;
  }, [dataSource]);

  const clearInlineEdit = useCallback((clearEditItem: boolean) => {
    setLocalData(dataSource);

    if (clearEditItem) {
      editItem.current = null;
    }
  }, [setLocalData, dataSource]);

  const getRow = useCallback((editInfo: TypeEditInfo): [T, boolean] => {
    const currentItem = localDataSource[editInfo.rowIndex];
    const isDirty = currentItem?.$dirty || currentItem[editInfo.columnId] !== editInfo.value;

    return [currentItem, isDirty];
  }, [localDataSource]);

  const editStart = useCallback((editInfo: TypeEditInfo) => {
    currentEditInfo.current = editInfo;

    const item = localDataSource[editInfo.rowIndex];

    onEditStart?.(editInfo);

    if (!editItem.current || editItem.current === item) {
      prevEditInfo.current = editInfo;
      editItem.current = item;
      return;
    }

    const { rowIndex, columnId } = prevEditInfo?.current || {};

    gridRef?.current?.cancelEdit({ rowIndex, columnId });
    editItem.current = item;
  }, [gridRef, localDataSource, onEditStart]);

  const editComplete = useCallback((editInfo: TypeEditInfo) => {
    const [currentItem, isDirty] = getRow(editInfo);

    const item = {
      ...currentItem,
      [editInfo.columnId]: editInfo.value,
      $dirty: isDirty,
    };

    const newLocalData = [...localDataSource];
    newLocalData[editInfo.rowIndex] = item;
    setLocalData(newLocalData);

    editItem.current = isDirty ? item : null;
    onEditComplete?.(editInfo, isDirty);
  }, [localDataSource, onEditComplete, getRow]);

  const editCancel = useCallback((editInfo: TypeEditInfo) => {
    // Clearing the edit mode happens when the cancel action is triggered on the current row.
    // Editing another row triggers the cancelling of the old row (if any)
    const clearEditing = editInfo.rowIndex === currentEditInfo.current?.rowIndex;
    clearInlineEdit(clearEditing);

    if (clearEditing) {
      onEditCancel?.(editInfo, editItem.current !== null);
    }
  }, [clearInlineEdit, onEditCancel]);

  const editStop = useCallback((editInfo: TypeEditInfo) => {
    const [, isDirty] = getRow(editInfo);

    if (isDirty) {
      return;
    }

    clearInlineEdit(false);

  }, [clearInlineEdit, getRow]);

  const tableColumns = useMemo(() => {
    if (!actionsColumn) {
      return columns;
    }

    return [
      ...columns.map(c => ({ ...c, editable: inlineEdit && (c?.editable || editableDefault) })),
      {
        header: 'Actions',
        ...actionsColumn,
        sortable: false,
        editable: false,
        render({ data, rowIndex, rowId, columnId, columnIndex }: any) {
          const editInfo: TypeEditInfo = {
            rowId,
            rowIndex,
            columnId,
            columnIndex,
          };

          return (
            <ActionsCell
              gridRef={gridRef}
              fieldFocusId={targetCol}
              record={data}
              rowIndex={rowIndex}
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              onCancel={() => editCancel(editInfo)}
              editDisabled={actionsColumn.editDisabled}
              deleteDisabled={actionsColumn.deleteDisabled}
            />
          );
        },
      },
    ];
  }, [columns, actionsColumn, gridRef, targetCol, onSave, onDelete, editableDefault, inlineEdit, onEdit, editCancel]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <ReactDataGrid
      style={style}
      dataSource={localDataSource}
      {...reactDataGridProps}
      {...props}
      onReady={(ref) => {
        setGridRef(ref);

        if (onReady) {
          onReady(ref);
        }
      }}
      columns={tableColumns}
      onEditStart={editStart}
      onEditComplete={editComplete}
      onEditCancel={editCancel}
      onEditStop={editStop}
    />
  );
  /* eslint-enable */
}

DataGrid.defaultProps = {
  actionsColumn: undefined,
  onDelete: undefined,
  onSave: undefined,
  editableDefault: undefined,
  inlineEdit: true,
  onEdit: undefined,

  onEditStart: undefined,
  onEditComplete: undefined,
  onEditCancel: undefined,
  onReady: undefined,
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
