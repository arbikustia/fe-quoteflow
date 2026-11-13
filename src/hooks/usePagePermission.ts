import { useMemo } from "react";

import {
  findUserRole,
  getAccessTokenRoles,
  getUsername,
  isSuperadminRole,
  normalizeUserRoles,
} from "@/components/Sidebar/Sidebar.helpers";

import type { ApiPermissionMenu } from "@/modules/permission/Permission.type";
import { checkPermission, flattenPermissionMenus } from "@/modules/permission/Permission.util";
import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useGetUsersQuery } from "@/services/master-user.service";
import { useGetUserPermissionQuery } from "@/services/permission.service";

/**
 * Hook to check page permissions for the current user.
 */
export const usePagePermission = (url: string): { canView: boolean; canCreate: boolean; canEdit: boolean; isSuperadmin: boolean; isLoading: boolean } => {
  const username = getUsername();
  const { data: usersResponse } = useGetUsersQuery({ PageNumber: 1, PageSize: 10, SearchTerm: username }, { skip: !username });
  const { data: rolesResponse } = useGetAllRolesQuery();
  const permissionQuery = useGetUserPermissionQuery(username, { skip: !username });

  const rows = useMemo(() => (permissionQuery.data?.status && permissionQuery.data.data ? flattenPermissionMenus(permissionQuery.data.data.menus) : []), [permissionQuery.data]);
  const role = findUserRole(usersResponse?.data ?? [], username);
  const userRoles = normalizeUserRoles(role);
  const isSuperadmin = isSuperadminRole([...getAccessTokenRoles(), ...userRoles], rolesResponse?.data ?? []);

  return {
    canView: isSuperadmin || checkPermission(rows, url, "view"),
    canCreate: isSuperadmin || checkPermission(rows, url, "create"),
    canEdit: isSuperadmin || checkPermission(rows, url, "edit"),
    isSuperadmin,
    isLoading: permissionQuery.isLoading,
  };
};

/**
 * Hook to get all accessible permission menus for the current user.
 */
export const useAllPermissions = (): { menus: ApiPermissionMenu[]; isLoading: boolean } => {
  const username = getUsername();
  const permissionQuery = useGetUserPermissionQuery(username, { skip: !username });
  return { 
    menus: permissionQuery.data?.status && permissionQuery.data.data ? permissionQuery.data.data.menus : [],
    isLoading: permissionQuery.isLoading 
  };
};
