import { Button, Checkbox, Col, Form, Modal, Radio, Row, Spin, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { IPermissionGroup, IRolePermissionsModal } from './types';
import {
  useGetPermissionsQuery,
} from '../../redux/api/userManagement';
import { groupByKey } from '../../util/strings';
import { objectToArray } from '../../util';
import { PermissionsLevels } from '../../types/enums';
import { GroupMainRow, GroupWrapper, PermissionsGroupsWrapper, PermissionsWrapper, GroupItem, GroupBody } from './styledComponents';
import hasPermission from "../../util/permissions";
import {Permissions} from "../../constants/enums/permissions";

const PermissionGroup: React.FC<IPermissionGroup> = ({ items, name, onCheckAll, editMode }) => {
  const [none, setNone] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [viewEdit, setViewEdit] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  useEffect(() => {
    setNone(false);
    setView(false);
    setViewEdit(false);
    setAdmin(false);
  }, [editMode]);
  return (
    <GroupWrapper>
      <Row>
        <Col span={24}>
          <GroupMainRow>
            <Row>
              <Col span={12}>
                <h3>{name}</h3>
              </Col>
              <Col span={3}>
                <Checkbox
                  disabled={!editMode}
                  onClick={() => {
                    onCheckAll(PermissionsLevels.NONE, items[0].Scope);
                    setNone(true);
                    setView(false);
                    setViewEdit(false);
                    setAdmin(false);
                  }}
                  checked={none}
                >
                  None
                </Checkbox>
              </Col>
              <Col span={3}>
                {PermissionsLevels.VIEW <= items[0].MaxLevel && (
                  <Checkbox
                    disabled={!editMode}
                    onClick={() => {
                      onCheckAll(PermissionsLevels.VIEW, items[0].Scope);
                      setNone(false);
                      setView(true);
                      setViewEdit(false);
                      setAdmin(false);
                    }}
                    checked={view}
                  >
                    View
                  </Checkbox>
                )}
              </Col>
              <Col span={3}>
                {PermissionsLevels.VIEW_EDIT <= items[0].MaxLevel && (
                  <Checkbox
                    disabled={!editMode}
                    onClick={() => {
                      onCheckAll(PermissionsLevels.VIEW_EDIT, items[0].Scope);
                      setNone(false);
                      setView(false);
                      setViewEdit(true);
                      setAdmin(false);
                    }}
                    checked={viewEdit}
                  >
                    View & Edit
                  </Checkbox>
                )}
              </Col>
              <Col span={3}>
                {PermissionsLevels.ADMIN <= items[0].MaxLevel && (
                  <Checkbox
                    disabled={!editMode}
                    onClick={() => {
                      onCheckAll(PermissionsLevels.ADMIN, items[0].Scope);
                      setNone(false);
                      setView(false);
                      setViewEdit(false);
                      setAdmin(true);
                    }}
                    checked={admin}
                  >
                    Admin
                  </Checkbox>
                )}
              </Col>
            </Row>
          </GroupMainRow>
          <GroupBody>
            {items.map((i: Entities.IPermission, index: number) => (
              <GroupItem key={i.PermissionNum} className={index % 2 ? 'gray-stripe' : 'white-stripe'}>
                <Row>
                  <Col span={12} style={{ textAlign: 'right', paddingRight: '90px' }}>
                    <h3>{i.PermissionName}</h3>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['permissions', i.PermissionNum]}
                      style={{ marginBottom: '0px' }}
                      initialValue={PermissionsLevels.NONE}
                    >
                      <Radio.Group disabled={!editMode} name={i.PermissionNum.toString()} style={{ width: '100%' }} defaultValue={PermissionsLevels.NONE}>
                        <Row>
                          <Col span={24}>
                            <Row>
                              <Col span={6}>
                                <Radio value={PermissionsLevels.NONE} />
                              </Col>
                              <Col span={6}>
                                {PermissionsLevels.VIEW <= i.MaxLevel && (
                                  <Radio value={PermissionsLevels.VIEW} />
                                )}
                              </Col>
                              <Col span={6}>
                                {PermissionsLevels.VIEW_EDIT <= i.MaxLevel && (
                                  <Radio value={PermissionsLevels.VIEW_EDIT} />
                                )}
                              </Col>
                              <Col span={6}>
                                {PermissionsLevels.ADMIN <= i.MaxLevel && (
                                  <Radio value={PermissionsLevels.ADMIN} />
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </GroupItem>
            ))}
          </GroupBody>
        </Col>
      </Row>
    </GroupWrapper>
  );
};

const RolePermissionsModal: React.FC<IRolePermissionsModal> = ({ role, show, onClose, loading, onAllSelected, onSave, isSaving, formUpdated, resetPermissions, editMode, enableEditMode }) => {
  const [dialogIsFullscreen, setDialogIsFullscreen] = useState<boolean>(false);
  const { data: permissions = [], isFetching: isFetchingPermissions } = useGetPermissionsQuery();
  const permissionsGrouped = objectToArray(groupByKey(permissions, 'Scope'));
  const profiles = useSelector((state: any) => state.profiles);
  const onSelectAll = useCallback((level: PermissionsLevels, scope: string) => {
    onAllSelected(permissions, level, scope);
  }, [onAllSelected, permissions]);

  const toggleDialogFullscreen = () => {
    setDialogIsFullscreen(!dialogIsFullscreen);
  };

  const dialogWidth = () => {
    if (dialogIsFullscreen) {
      return window.innerWidth;
    }

    return window.innerWidth > 1280 ? window.innerWidth * 0.8 : 1200;
  };
  const loadingModal = loading || isFetchingPermissions || isSaving;
  const modalTitle = (
    <>
      <Row align="middle" justify="space-between">
        <Col span={12}>
          <Row>
            <Col span={24}>
              <Typography.Title level={4}>Role Permissions</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button onClick={toggleDialogFullscreen}>
            {dialogIsFullscreen ? 'Exit' : 'Enter'}
            {' '}
            Fullscreen
            {dialogIsFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </Button>
          <Tooltip placement="bottom" title="Close">
            <Button type="text" onClick={onClose} style={{ padding: '0 8px' }}>
              <CloseOutlined />
            </Button>
          </Tooltip>
        </Col>
      </Row>
    </>
  );

  return (
    <Modal
      bodyStyle={{ padding: 0 }}
      centered
      className="fullscreen-modal"
      width={dialogWidth()}
      closable={false}
      footer={false}
      onCancel={onClose}
      style={{ padding: 0 }}
      visible={show}
      onOk={onSave}
      title={modalTitle}
    >
      <Spin spinning={loadingModal}>
        <PermissionsWrapper
          className={dialogIsFullscreen ? 'fullscreen-mode' : ''}
        >
          <Row>
            <Col span={21}>
              <Typography.Text strong style={{ fontSize: '18px' }}>
                {loadingModal ? 'Loading...' : `Add or edit permission for ${role.roleName}`}
              </Typography.Text>
            </Col>
            {editMode ? (
              <>
                <Col span={2} style={{ textAlign: 'right', paddingRight: '5px' }}>
                  <Button loading={loadingModal} onClick={() => {resetPermissions();}}>Cancel</Button>
                </Col>
                <Col span={1}>
                  <Button disabled={!formUpdated} loading={loadingModal} onClick={onSave} type="primary">Save</Button>
                </Col>
              </>
            ) : (
              <Col span={3} style={{ textAlign: 'right', paddingRight: '5px' }}>
                <Button disabled={!hasPermission(profiles.permissions, Permissions.USER_PERMISSION, PermissionsLevels.VIEW)} onClick={enableEditMode}>Edit</Button>
              </Col>
            )}
          </Row>
          <PermissionsGroupsWrapper>
            {permissionsGrouped.map( (permission: Array<any>) => (
              <PermissionGroup editMode={editMode} onCheckAll={onSelectAll} key={permission[0].Scope} name={permission[0].Scope} items={permission} />
            ))}
          </PermissionsGroupsWrapper>
        </PermissionsWrapper>
      </Spin>
    </Modal>
  );
};

export default RolePermissionsModal;
