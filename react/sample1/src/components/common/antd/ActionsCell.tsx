import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React, { useCallback } from 'react';

interface ActionsCellProps {
  editMode?: boolean;

  onEdit?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;

  hideEditSaveButton?: boolean;
  hideDeleteCancelButton?: boolean;
  disableEditSaveButton?: boolean;
  disableDeleteCancelButton?: boolean;
}

const ActionsCell: React.FC<ActionsCellProps> = (
  {
    editMode,
    onEdit,
    onSave,
    onDelete,
    onCancel,
    hideDeleteCancelButton,
    hideEditSaveButton,
    disableEditSaveButton,
    disableDeleteCancelButton
  },
) => {
  const onEditSaveClick = useCallback(() => {
    if (editMode) {
      onSave?.();
    } else {
      onEdit?.();
    }
  }, [editMode, onEdit, onSave]);

  const onDeleteCancelClick = useCallback(() => {
    if (editMode) {
      onCancel?.();
    } else {
      onDelete?.();
    }
  }, [editMode, onCancel, onDelete]);

  return (
    <Row gutter={14}>
      {
        !hideEditSaveButton && (
          <Col>
            <Button
              onClick={onEditSaveClick}
              disabled={disableEditSaveButton}
            >
              {
                editMode ? 'Edit' : 'Save'
              }
              {
                editMode ? <EditOutlined /> : <CheckOutlined />
              }
            </Button>
          </Col>
        )
      }
      {
        !hideDeleteCancelButton && (
          <Col>
            <Button
              danger={!editMode}
              onClick={onDeleteCancelClick}
              disabled={disableDeleteCancelButton}
            >
              {
                editMode ? 'Cancel' : 'Delete'
              }
              {
                editMode ? <CloseOutlined /> : <DeleteOutlined />
              }
            </Button>
          </Col>
        )
      }
    </Row>
  );
};

ActionsCell.defaultProps = {
  editMode: false,
  onEdit: undefined,
  onSave: undefined,
  onDelete: undefined,
  onCancel: undefined,
  hideDeleteCancelButton: false,
  hideEditSaveButton: false,
  disableEditSaveButton: false,
  disableDeleteCancelButton: false,
};

export default ActionsCell;
