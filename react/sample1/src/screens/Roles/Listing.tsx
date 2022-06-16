import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, FormInstance, Input, Modal, notification, Row, Spin } from 'antd';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ContentLayout from '../../components/ContentLayout';
import Heading from '../../components/common/Heading';
import Spacer from '../../components/common/Spacer';
import SiteContent from '../../components/SiteContent';
import {
  useGetProfileRolesQuery, usePatchProfileRolesMutation,
  usePostProfileRolesMutation,
  usePostRolePermissionsMutation,
} from '../../redux/api/userManagement';
import { IAddNewRoleModalProps, IRoleForm, IRolesTableRecord } from './types';
import FormElement from '../../components/common/FormElement';
import RolePermissionsModal from './RolePermissionsModal';
import { deleteRole, fetchRolePermissions } from '../../services/userManagement';
import { PermissionsLevels } from '../../types/enums';
import { groupByKey } from '../../util/strings';
import { EditActionsWrapper, GrayTableButton, TableButtonWrapper } from './styledComponents';
import { useDebounce } from '../../util';
import DeleteIcon from '../../assets/icons/delete';
import ConfirmationModal from '../../components/ConfirmationModal';
import CheckMark from '../../assets/icons/checkmark';
import CancelIcon from '../../assets/icons/clear';
import EditIcon from '../../assets/icons/edit';
import hasPermission from '../../util/permissions';
import { Permissions } from '../../constants/enums/permissions';

const AddNewRoleModal: React.FC<IAddNewRoleModalProps> = ({ show, closeModal, isSaving }) => (
  <Modal
    visible={show}
    onCancel={closeModal}
    title="Add New Role"
    closable
    okText="Save"
    footer={(
      <>
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          form="roles"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={isSaving}
        >
          Save
        </Button>
      </>
    )}
  >
    <FormElement
      formItemProperties={{
        labelCol: {
          span: 3,
        },
        wrapperCol: {
          span: 21,
        },
        name: ['newRole', 'roleName'],
        label: 'Name',
        rules: [
          { required: true, message: 'Field required.' },
        ],
      }}
      inputProperties={{
        placeholder: 'Type Name',
        name: 'roleName',
      }}
    />
    <FormElement
      formItemProperties={{
        labelCol: {
          span: 3,
        },
        wrapperCol: {
          span: 21,
        },
        name: ['newRole', 'note'],
        label: 'Note',
        rules: [
          { required: true, message: 'Field required.' },
        ],
      }}
      inputProperties={{
        placeholder: 'Type Note',
        name: 'note',
      }}
    />
  </Modal>
);

const initialRoleSelectedValues = {
  roleName: '',
  note: '',
  rowNum: 0,
};

const resetEditPermissionsValues = (permissions: Array<object>, form: FormInstance) => {
  const permissionsReseted = permissions.reduce((p: any, c: any) => {
    const r = { ...p };
    r[c[0]] = 0;
    return r;
  }, {});
  form.setFieldsValue({
    permissions: {
      ...permissionsReseted,
    },
  });
};

const RolesListingScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formUpdated, setFormUpdated] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState(-1);
  const [rolePermissionsSelected, setRolePermissionsSelected] = useState<Entities.IGetProfileRolesByRoleResponse[]>([]);
  const [isFetchingRolePermissions, setIsFetchingRolePermissions] = useState<boolean>(false);
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleSelected, setRoleSelected] = useState<Entities.IGetProfileRolesResponse>(initialRoleSelectedValues);
  const { data: roles = [], isFetching: isFetchingRoles, refetch: refetchRoles } = useGetProfileRolesQuery();
  const [filteredRoles, setFilteredRoles] = useState<Entities.IGetProfileRolesResponse[]>(roles);
  const [createNewRole, { status: savedNewRoleStatus, isLoading: isSavingNewRole }] = usePostProfileRolesMutation();
  const [editingRole, { status: editingRoleStatus, isLoading: isEditingRole }] = usePatchProfileRolesMutation();
  const [savePermissions, { isLoading: savePermissionsLoading }] = usePostRolePermissionsMutation();
  const profileSelectedIndex = useSelector((state: any) => state.profiles.selectedIndex);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const profile = useSelector((state: any) => state.profiles.profiles[profileSelectedIndex]);
  const profiles = useSelector((state: any) => state.profiles);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const onFormUpdated = useCallback(() => {
    if (!formUpdated) {
      setFormUpdated(true);
    }

  }, [formUpdated]);
  const setRolePermissionsFormValues = useCallback((permissions?: Entities.IGetProfileRolesByRoleResponse[]) => {
    let rolePermissions = permissions;
    if (!rolePermissions) {
      rolePermissions = rolePermissionsSelected;
    }
    const rolePermissionsForm = rolePermissions.reduce((p: any, c: Entities.IGetProfileRolesByRoleResponse) => {
      const r = { ...p };
      r[c.permissionNum] = c.permissionLevel;
      return r;
    }, {});
    form.resetFields();
    form.setFieldsValue(0);
    if (!isEmpty(rolePermissionsForm)) {
      form.setFieldsValue({
        permissions: {
          ...form.getFieldValue('permissions'),
          ...rolePermissionsForm,
        },
      });
    }
    setFormUpdated(false);
    setEditMode(false);
  }, [form, rolePermissionsSelected]);

  const onShowEditPermissionsModal = useCallback(async (record: Entities.IGetProfileRolesResponse) => {
    setIsFetchingRolePermissions(true);
    setShowEditPermissionsModal(true);
    setEditMode(false);
    try {
      const rolePermissions =  await fetchRolePermissions(record.rowNum);
      setRolePermissionsFormValues(rolePermissions);
      setRolePermissionsSelected(rolePermissions);
      setRoleSelected(record);
    } catch {
      notification.error({ message: 'Could not retrieve role permissions' });
    } finally {
      setIsFetchingRolePermissions(false);
    }
  }, [setRolePermissionsFormValues]);

  const handleConfirmationModal = (role: Entities.IGetProfileRolesResponse) => {
    setShowConfirmation(true);
    setRoleSelected(role);
  };
  const isEditing = (data: IRolesTableRecord) => data.rowNum === editingKey;

  const edit = (data: IRolesTableRecord) => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      editingRecord: { ...data },
    });
    setEditingKey(data.rowNum);
  };

  const cancel = () => {
    setEditingKey(-1);
  };

  const onEditRole = useCallback(async () => {
    const formValues = form.getFieldValue('editingRecord');
    const payload = {
      note: formValues.note,
      roleName: formValues.roleName,
      rowNum: formValues.rowNum,
    };
    await editingRole(payload);

    if (editingRoleStatus) {
      notification.success({ message: 'Role Updated!' });
    } else {
      notification.success({ message: 'There was an error' });
    }
    cancel();
    refetchRoles();
    form.resetFields();
  }, [editingRole, editingRoleStatus, form, refetchRoles]);

  const columns = [
    {
      header: 'Name',
      name: 'roleName',
      defaultFlex: 1,
      render: ({ data }: any) => {
        const editable = isEditing(data);
        return !editable ? data.roleName : (
          <FormElement
            formItemProperties={{
              name: ['editingRecord', 'roleName'],
              style: { marginTop: '30px' },
            }}
            inputProperties={{
              placeholder: 'Name',
            }}
          />
        );
      },
    },
    {
      header: 'Note',
      name: 'note',
      defaultFlex: 1.5,
      render: ({ data }: any) => {
        const editable = isEditing(data);
        return !editable ? data.note : (
          <FormElement
            formItemProperties={{
              name: ['editingRecord', 'note'],
              style: { marginTop: '30px' },
            }}
            inputProperties={{
              placeholder: 'Note',
            }}
          />
        );
      },
    },
    {
      header: '',
      name: 'actions',
      render: ({ data }: any) => {
        const editable = isEditing(data);

        return (
          <Row>
            <Col span={12}>
              <GrayTableButton onClick={() => { onShowEditPermissionsModal(data); }}>Manage Permissions</GrayTableButton>
            </Col>
            <Col span={12}>
              <EditActionsWrapper>
                {
                  editable ? (
                    <>
                      <TableButtonWrapper onClick={() => {onEditRole();}} style={{ marginRight: 8 }}>
                        <Spin spinning={isEditingRole}>
                          <CheckMark height={25} width={25} style={{ fill: '#02a800' }} />
                        </Spin>
                      </TableButtonWrapper>
                      <TableButtonWrapper onClick={() => {cancel();}} style={{ marginRight: 8 }}>
                        <CancelIcon height={25} width={25} style={{ fill: '#2d3f5d' }} />
                      </TableButtonWrapper>
                    </>
                  ) : hasPermission(profiles.permissions, Permissions.USER_PERMISSION, PermissionsLevels.VIEW) && (
                    <>
                      <TableButtonWrapper onClick={() => {edit(data);}}>
                        <EditIcon height={25} width={25} style={{ fill: '#006dff' }} />
                      </TableButtonWrapper>
                      <TableButtonWrapper onClick={() => handleConfirmationModal(data)} style={{ marginLeft: 10 }}>
                        <DeleteIcon height={25} width={25} style={{ fill: '#c13939' }} />
                      </TableButtonWrapper>
                    </>
                  )
                }
              </EditActionsWrapper>
            </Col>
          </Row>
        );
      },
      defaultFlex: 2,
    },
  ];
  const onHideEditPermissionsModal = useCallback(() => {
    setShowEditPermissionsModal(false);
    setEditMode(false);
  }, []);
  const onShowHideCreateModal = useCallback((value: boolean) => setShowCreateModal(value), []);
  const onSaveNewRole = useCallback(async (values: IRoleForm) => {
    await createNewRole(values.newRole);
    setShowCreateModal(false);
    if (savedNewRoleStatus) {
      notification.success({ message: 'New Role Added' });
    } else {
      notification.success({ message: 'There was an error' });
    }
    refetchRoles();
    form.resetFields();
  }, [createNewRole, form, refetchRoles, savedNewRoleStatus]);

  const handleSelectedAll = (permissions: Entities.IPermission[], level: PermissionsLevels, scope: string) => {
    const scopePermissions = permissions.filter((p: Entities.IPermission) => p.Scope === scope);
    const permissionNums = groupByKey(scopePermissions, 'PermissionNum');
    const newFormValues = Object.keys(permissionNums).reduce((p: any, c: string) => {
      const r = { ...p };
      r[c] = level;
      return r;
    }, {});
    form.setFieldsValue({
      ...form.getFieldsValue(),
      permissions: {
        ...form.getFieldValue('permissions'),
        ...newFormValues,
      },
    });
    setFormUpdated(true);
  };

  const onSaveEditPermissions = useCallback(async () => {
    const permissions = Object.entries(form.getFieldValue('permissions'));
    const payload: Entities.IPostProfileRolesByRolePayload[] = permissions.map(p => ({
      roleNum: roleSelected.rowNum,
      permissionNum: Number(p[0]),
      permissionLevel: Number(p[1]),
      masterAccountNum: profile.MasterAccountNum,
      profileNum: profile.ProfileNum,
    })).filter(f => f.permissionLevel || f.permissionLevel === PermissionsLevels.NONE);
    await savePermissions({ rowNum: roleSelected.rowNum, permissions: payload });
    setShowEditPermissionsModal(false);
    refetchRoles();
    notification.success({ message: 'Permissions Saved' });
    resetEditPermissionsValues(permissions, form);
    setFormUpdated(false);
    setEditMode(false);
  }, [form, profile.MasterAccountNum, profile.ProfileNum, refetchRoles, roleSelected.rowNum, savePermissions]);

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleSelected.rowNum);
      notification.success({ message: 'Role deleted sucessfully!' });
    } catch {
      notification.error({ message: 'Could not delete the role' });
    } finally {
      refetchRoles();
    }
  };

  useEffect(() => {
    if (roles.length === 0) {
      return;
    }

    if (debouncedSearchTerm) {
      const newFilteredRoles = roles.filter( f => f.roleName.toLowerCase().includes(debouncedSearchTerm) || f.note.toLowerCase().includes(debouncedSearchTerm));
      setFilteredRoles(newFilteredRoles);
    } else {
      setFilteredRoles(roles);
    }
  }, [debouncedSearchTerm, roles]);

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value), []);

  return (
    <ContentLayout>
      <Form.Provider onFormChange={onFormUpdated}>
        <Form
          name="roles"
          form={form}
          onFinish={onSaveNewRole}
        >
          <ConfirmationModal
            visible={showConfirmation}
            title={`Are you sure you want to delete ${roleSelected.roleName}?`}
            handleCancel={() => { setShowConfirmation(false); }}
            handleConfirm={handleDeleteRole}
          />
          <AddNewRoleModal
            show={showCreateModal}
            closeModal={() => {onShowHideCreateModal(false);}}
            isSaving={isSavingNewRole}
          />
          <RolePermissionsModal
            loading={isFetchingRolePermissions}
            show={showEditPermissionsModal}
            role={roleSelected}
            onClose={onHideEditPermissionsModal}
            onAllSelected={handleSelectedAll}
            onSave={onSaveEditPermissions}
            isSaving={savePermissionsLoading}
            formUpdated={formUpdated}
            resetPermissions={setRolePermissionsFormValues}
            editMode={editMode}
            enableEditMode={() => {setEditMode(true);}}
          />
          <Heading
            title="Roles"
            actions={(
              <Button
                type="primary"
                onClick={() => {onShowHideCreateModal(true);}}
              >
                Add New Role
                <PlusOutlined />
              </Button>
        )}
          />
          <Spacer />
          <SiteContent>
            <Row>
              <Col span={8}>
                <Input style={{ marginBottom: '15px' }} prefix={<SearchOutlined />} allowClear onChange={onSearchChange} />
              </Col>
              <Col span={24}>
                <ReactDataGrid
                  style={{ minHeight: '80vh' }}
                  columns={columns}
                  rowHeight={60}
                  enableKeyboardNavigation={false}
                  dataSource={filteredRoles}
                  showZebraRows={false}
                  loading={isFetchingRoles}
                />
              </Col>
            </Row>
          </SiteContent>
        </Form>
      </Form.Provider>
    </ContentLayout>
  );
};

export default RolesListingScreen;
