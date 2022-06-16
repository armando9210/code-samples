import { Permissions, ViewLevel } from '../constants/enums/permissions';
import { PermissionsLevels } from '../types/enums';

export default function hasPermission(permissions: Map<Permissions, Entities.ProfileUserPermission>, permission: Permissions, level: ViewLevel | PermissionsLevels) {
  if (!permissions) {
    return false;
  }

  const profile = permissions.get(permission);

  if (!profile) {
    return false;
  }

  return profile.PermissionLevel > level;
}
