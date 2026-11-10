import * as React from "react";

import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useGetUsersQuery } from "@/services/master-user.service";
import { useGetUserPermissionQuery } from "@/services/permission.service";
import { flattenPermissionMenus } from "@/modules/permission/Permission.helpers";

import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_SECTIONS } from "./Sidebar.config";
import { filterNavigationByPermission, findUserRole, getAccessTokenRoles, getNavigationSectionsForRole, getUsername, isSuperadminRole, normalizeUserRoles } from "./Sidebar.helpers";
import { useLogoutState, useSidebarState } from "./Sidebar.hook";
import type { LogoutState, SidebarContainerProps } from "./Sidebar.type";
import ConfirmModal from "../ConfirmModal";
import { useTheme } from "../../store/theme.hook";

/**
 * Render logout confirmation modal.
 * @param {LogoutState} props - logout modal state
 * @returns {React.ReactElement} - ConfirmModal element
 */
const _renderLogoutConfirmModal = (props: LogoutState): React.ReactElement => (
  <ConfirmModal
    isOpen={props.isLogoutConfirmOpen}
    onClose={props.closeLogoutConfirm}
    onConfirm={props.confirmLogout}
    title="Confirm logout"
    message="Are you sure you want to log out?"
    confirmText="Log out"
    cancelText="Cancel"
    isDestructive={true}
  />
);

/**
 * Render Sidebar Container
 * @param {SidebarContainerProps} props - container props
 * @returns {React.ReactElement} - Sidebar Container
 */
const SidebarContainer = (props: SidebarContainerProps = {}): React.ReactElement => {
  const { isCollapsed = false } = props;
  const {
    currentPath,
    openMenus,
    onToggleMenu,
    isProfileOpen,
    onToggleProfile,
  } = useSidebarState();
  const { theme } = useTheme();
  const logoutState = useLogoutState();
  const username = getUsername();
  const { data: usersResponse } = useGetUsersQuery({
    PageNumber: 1,
    PageSize: 10,
    SearchTerm: username,
  }, { skip: !username });
  const { data: rolesResponse } = useGetAllRolesQuery();
  const permissionQuery = useGetUserPermissionQuery(username, { skip: !username });
  const role = findUserRole(usersResponse?.data ?? [], username);
  const userRoles = normalizeUserRoles(role);
  const isSuperadmin = isSuperadminRole([...getAccessTokenRoles(), ...userRoles], rolesResponse?.data ?? []);
  let navigation = getNavigationSectionsForRole(NAVIGATION_SECTIONS, isSuperadmin ? "superadmin" : "");

  if (!isSuperadmin && permissionQuery.data?.status && permissionQuery.data.data) {
    const rows = flattenPermissionMenus(permissionQuery.data.data.menus);
    navigation = filterNavigationByPermission(navigation, rows);
  }

  return (
    <>
      <SidebarComponent
        navigation={navigation}
        currentPath={currentPath}
        openMenus={openMenus}
        onToggleMenu={onToggleMenu}
        isCollapsed={isCollapsed}
        isProfileOpen={isProfileOpen}
        onToggleProfile={onToggleProfile}
        theme={theme}
        onLogout={logoutState.handleLogout}
      />
      {_renderLogoutConfirmModal(logoutState)}
    </>
  );
};

export default SidebarContainer;
