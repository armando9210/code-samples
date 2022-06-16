import { CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Permissions, ViewLevel } from '../../constants/enums/permissions';

type FormButtonsProps = {
  /**
   * Determines if the buttons are on edit mode, this implies toggling between
   * Save/Cancel and Edit/Delete.
   */
  editingMode: boolean;

  permissionNumber: Permissions;

  disabled?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableSave?: boolean;
  disableCancel?: boolean;

  saving?: boolean;
  deleting?: boolean;

  hideEdit?: boolean;
  hideDelete?: boolean;
  hideSave?: boolean;
  hideCancel?: boolean;

  onEdit?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  onSave?: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties,
};

const hasPermissions = (permissions: any, permissionNum: number, permissionLevel: number) => {
  if (permissions && permissions.size === 0) return false;
  return permissions.get(permissionNum)?.PermissionLevel > permissionLevel;
};

const FormButtons: React.FC<FormButtonsProps> = (
  {
    editingMode,
    permissionNumber,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    disableSave,
    disableCancel,
    disableEdit,
    disableDelete,
    disabled,
    hideEdit,
    hideCancel,
    hideDelete,
    hideSave,
    saving,
    deleting,
    style,
  },
) => {
  const userProfiles = useSelector((state: any) => state.profiles);

  const hasPermission = hasPermissions(userProfiles.permissions, permissionNumber, ViewLevel.VIEW);
  const editSaveButtonText = editingMode ? 'Save' : 'Edit';
  const editSaveButtonIcon = editingMode ? <SaveOutlined /> : <EditOutlined />;
  const deleteCancelButtonText = editingMode ? 'Cancel' : 'Delete';
  const deleteCancelButtonIcon = editingMode ? <CloseOutlined /> : <DeleteOutlined />;

  const showSecondButton = useMemo(() => {
    if (editingMode) {
      return !hideCancel;
    }

    return !hideDelete;
  }, [editingMode, hideCancel, hideDelete]);

  const loadingFirstButton = useMemo(() => {
    if (!editingMode) {
      return false;
    }

    return saving;
  }, [editingMode, saving]);

  const loadingSecondButton = useMemo(() => {
    if (editingMode) {
      return false;
    }

    return deleting;
  }, [editingMode, deleting]);

  /**
   * Indicates if the first button should be disabled, that only happens when:
   *  - The whole component input is disabled by specifying `disabled`
   *  - If in regular mode, if `disableEdit` is set
   *  - If on edit mode, if `saving` is set
   */
  const disableFirstButton = useMemo(() => {
    if (disabled) {
      return disabled;
    }

    if (editingMode) {
      return disableSave;
    }

    return disableEdit || deleting;
  }, [editingMode, deleting, disabled, disableEdit, disableSave]);

  const disableSecondButton = useMemo(() => {
    if (disabled) {
      return disabled;
    }

    if (editingMode) {
      return disableCancel || saving;
    }

    return disableDelete;
  }, [disabled, editingMode, saving, disableDelete, disableCancel]);

  const onEditSaveClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (editingMode) {
      onSave?.(e);
    } else {
      onEdit?.(e);
    }
  }, [onEdit, onSave, editingMode]);

  const onDeleteCancelClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (editingMode) {
      onCancel?.(e);
    } else {
      onDelete?.(e);
    }
  }, [onDelete, onCancel, editingMode]);

  // No need to render if the user does not have permission
  if (!hasPermission) {
    return null;
  }

  /**
   * First buttons are duplicated in order to prevent a race condition
   * where `antd.Form` checks the event.target button type.
   */

  return (
    <Row gutter={14} style={style}>
      <Col>
        {
          !hideSave && (
            <Button
              type="primary"
              onClick={onEditSaveClick}
              loading={loadingFirstButton}
              disabled={disableFirstButton}
              style={{ display: editingMode ? 'block' : 'none' }}
              htmlType="submit"
            >
              {editSaveButtonText}
              {editSaveButtonIcon}
            </Button>
          )
        }
        {
          !hideEdit && (
            <Button
              type="primary"
              onClick={onEditSaveClick}
              loading={loadingFirstButton}
              disabled={disableFirstButton}
              style={{ display: editingMode ? 'none' : 'block' }}
              htmlType="button"
            >
              {editSaveButtonText}
              {editSaveButtonIcon}
            </Button>
          )
        }
      </Col>
      <Col>
        {
          showSecondButton && (
            <Button
              type={editingMode ? 'default' : 'primary'}
              danger={!editingMode}
              onClick={onDeleteCancelClick}
              loading={loadingSecondButton}
              disabled={disableSecondButton}
              htmlType="button"
            >
              {deleteCancelButtonText}
              {deleteCancelButtonIcon}
            </Button>
          )
        }
      </Col>
    </Row>
  );
};

FormButtons.defaultProps = {
  disableDelete: false,
  disableEdit: false,
  disableSave: false,
  disableCancel: false,
  hideEdit: false,
  hideCancel: false,
  hideDelete: false,
  hideSave: false,
  saving: false,
  deleting: false,
  disabled: false,
  style: undefined,
};

export default FormButtons;
