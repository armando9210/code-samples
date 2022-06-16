import { PermissionsLevels } from '../../types/enums';

export interface IAddNewRoleModalProps {
  show: boolean,
  closeModal: () => void;
  isSaving: boolean;
}

export interface IRole {
  rowNum?: number;
  roleName: string;
  note: string;
}

export interface IRoleForm {
  newRole: IRole;
  permissions: object;
}

export interface IPermissionGroup {
  name: string;
  items: Array<any>;
  onCheckAll: (level: PermissionsLevels, scope: string) => void;
  editMode: boolean;
}

export interface IRolePermissionsModal {
  role: Entities.IGetProfileRolesResponse;
  show: boolean;
  onClose: () => void;
  loading: boolean;
  isSaving: boolean;
  onAllSelected: (permissions: Entities.IPermission[], type: PermissionsLevels, scope: string) => void;
  onSave: () => void;
  formUpdated: boolean;
  resetPermissions: () => void;
  editMode: boolean;
  enableEditMode: () => void;
}

export interface IRolesTableRecord {
  isActivated: boolean;
  masterAccountNum: number;
  note: string;
  profileNum: number;
  roleCode: string
  roleName: string;
  rowNum: number;
}
