import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PERMISSION_ALL_USERS, PERMISSION_USER_PAGE_SIZE } from "./Permission.config";
import type { PermissionRouteState, PermissionRowsState, PermissionState, PermissionUsersState } from "./Permission.type";
import { buildUserOptions, filterPermissionRows, flattenPermissionMenus, getPermissionErrorMessage } from "./Permission.util";

import { useGetUsersQuery } from "@/services/master-user.service";
import { useGetUserPermissionQuery } from "@/services/permission.service";

/**
 * Load the user select options with a remote search term.
 * @returns {PermissionUsersState} - User options state
 */
export const usePermissionUsers = (): PermissionUsersState => {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const usersQuery = useGetUsersQuery({ PageNumber: 1, PageSize: PERMISSION_USER_PAGE_SIZE, SearchTerm: userSearchTerm || undefined });
  const userOptions = useMemo(() => buildUserOptions(usersQuery.data?.data ?? []), [usersQuery.data]);

  return { userOptions, isLoadingUsers: usersQuery.isLoading, isUsersError: usersQuery.isError, onUserSearch: setUserSearchTerm };
};

/**
 * Load the permission rows of a user, filtered by a search term.
 * @param {string} username - Selected username
 * @param {string} searchTerm - Row search term
 * @returns {PermissionRowsState} - Permission rows state
 */
export const usePermissionRows = (username: string, searchTerm: string): PermissionRowsState => {
  const permissionQuery = useGetUserPermissionQuery(username, { skip: !username });
  const menus = permissionQuery.data?.status ? permissionQuery.data.data?.menus : undefined;
  const allRows = useMemo(() => flattenPermissionMenus(menus ?? []), [menus]);
  const rows = useMemo(() => filterPermissionRows(allRows, searchTerm), [allRows, searchTerm]);

  return {
    rows,
    isLoadingPermission: permissionQuery.isLoading,
    isPermissionError: permissionQuery.isError || permissionQuery.data?.status === false,
  };
};

/**
 * Manage the permission list page: user selection, rows and navigation.
 * @returns {PermissionState} - Permission page state
 */
export const usePermissionState = (): PermissionState => {
  const navigate = useNavigate();
  const routeState = useLocation().state as PermissionRouteState | null;
  const [selectedUsername, setSelectedUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const users = usePermissionUsers();
  const permission = usePermissionRows(selectedUsername, searchTerm);
  const errorMessage = getPermissionErrorMessage(users.isUsersError, permission.isPermissionError);

  /**
   * Open the assign page for the selected user, or all users.
   * @returns {void} - Nothing
   */
  const onOpenForm = (): void => {
    void navigate(`/permission/assign/${selectedUsername || PERMISSION_ALL_USERS}`);
  };

  /**
   * Navigate back to the dashboard.
   * @returns {void} - Nothing
   */
  const onBack = (): void => {
    void navigate("/home");
  };

  return {
    selectedUsername,
    userOptions: users.userOptions,
    rows: permission.rows,
    isLoadingUsers: users.isLoadingUsers,
    isLoadingPermission: permission.isLoadingPermission,
    errorMessage,
    formMessage: routeState?.message,
    isEmpty: Boolean(selectedUsername) && !permission.isLoadingPermission && !errorMessage && permission.rows.length === 0,
    onUsernameChange: setSelectedUsername,
    onUserSearch: users.onUserSearch,
    onSearchChange: setSearchTerm,
    onOpenForm,
    onBack,
  };
};
