import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PERMISSION_ALL_USERS, PERMISSION_SAVE_ERROR_MESSAGE, PERMISSION_SAVED_MESSAGE } from "../Permission.config";
import { usePermissionUsers } from "../Permission.hook";
import type { PermissionAction, PermissionFormPage, PermissionNavigate } from "../Permission.type";
import {
  buildPermissionPayload,
  countPermissions,
  flattenPermissionMenus,
  getPermissionPages,
  mergePermissions,
  setAllPermissions,
  setRowPermissions,
  togglePermission,
} from "../Permission.util";

import type { PermissionAssignFormState, PermissionAssignSaveState, PermissionAssignState, PermissionEditedPages } from "./PermissionAssign.type";

import { useGetUserPermissionQuery, useSaveUserPermissionMutation } from "@/services/permission.service";

/**
 * Manage the editable permission matrix of one user.
 * @param {string} username - Target username, empty for none
 * @returns {PermissionAssignFormState} - Matrix state and handlers
 */
export const usePermissionAssignForm = (username: string): PermissionAssignFormState => {
  const permissionQuery = useGetUserPermissionQuery(username, { skip: !username });
  const menus = permissionQuery.data?.status ? permissionQuery.data.data?.menus : undefined;
  const basePages = useMemo(() => mergePermissions(getPermissionPages(), flattenPermissionMenus(menus ?? [])), [menus]);
  const [edited, setEdited] = useState<PermissionEditedPages | null>(null);
  const formPages = edited?.source === basePages ? edited.pages : basePages;
  const counts = countPermissions(formPages);
  const isAllSelected = counts.total > 0 && counts.selected === counts.total;

  /**
   * Apply an edit on top of the loaded permissions; edits of stale data are dropped.
   * @param {(pages: PermissionFormPage[]) => PermissionFormPage[]} edit - Pure edit of the matrix
   * @returns {void} - Nothing
   */
  const applyEdit = (edit: (pages: PermissionFormPage[]) => PermissionFormPage[]): void => {
    setEdited((current) => ({ source: basePages, pages: edit(current?.source === basePages ? current.pages : basePages) }));
  };

  /**
   * Grant or revoke one action on one page.
   * @param {string} url - Page URL
   * @param {PermissionAction} permission - Action to change
   * @param {boolean} checked - Whether to grant it
   * @returns {void} - Nothing
   */
  const onPermissionChange = (url: string, permission: PermissionAction, checked: boolean): void => {
    applyEdit((pages) => togglePermission(pages, url, permission, checked));
  };

  /**
   * Grant or revoke every action on one page.
   * @param {string} url - Page URL
   * @param {boolean} checked - Whether to grant all
   * @returns {void} - Nothing
   */
  const onRowSelectChange = (url: string, checked: boolean): void => {
    applyEdit((pages) => setRowPermissions(pages, url, checked));
  };

  /**
   * Grant or revoke every action on every page.
   * @param {boolean} checked - Whether to grant all
   * @returns {void} - Nothing
   */
  const onSelectAllChange = (checked: boolean): void => {
    applyEdit((pages) => setAllPermissions(pages, checked));
  };

  return { formPages, isAllSelected, isPartiallySelected: counts.selected > 0 && !isAllSelected, onSelectAllChange, onRowSelectChange, onPermissionChange };
};

/**
 * Manage saving the permission matrix.
 * @param {string} username - Target username, empty for none
 * @param {PermissionFormPage[]} formPages - Matrix to save
 * @param {PermissionNavigate} navigate - Router navigate
 * @returns {PermissionAssignSaveState} - Save state and handler
 */
export const usePermissionAssignSave = (username: string, formPages: PermissionFormPage[], navigate: PermissionNavigate): PermissionAssignSaveState => {
  const [savePermission, saveState] = useSaveUserPermissionMutation();
  const [formMessage, setFormMessage] = useState<string>();

  /**
   * Save the matrix and return to the list on success.
   * @returns {Promise<void>} - Completion
   */
  const onSubmit = async (): Promise<void> => {
    if (!username) {
      return;
    }

    setFormMessage(undefined);

    try {
      const response = await savePermission(buildPermissionPayload(username, formPages)).unwrap();

      if (!response.status) {
        setFormMessage(PERMISSION_SAVE_ERROR_MESSAGE);

        return;
      }

      await navigate("/permission", { state: { message: PERMISSION_SAVED_MESSAGE } });
    } catch {
      setFormMessage(PERMISSION_SAVE_ERROR_MESSAGE);
    }
  };

  return { isSubmitting: saveState.isLoading, formMessage, onSubmit };
};

/**
 * Manage the assign permission page.
 * @returns {PermissionAssignState} - Assign page state
 */
export const usePermissionAssign = (): PermissionAssignState => {
  const navigate = useNavigate();
  const { username: routeUsername } = useParams<{ username: string }>();
  const username = routeUsername === PERMISSION_ALL_USERS ? "" : (routeUsername ?? "");
  const users = usePermissionUsers();
  const form = usePermissionAssignForm(username);
  const save = usePermissionAssignSave(username, form.formPages, navigate);

  /**
   * Switch the assign page to another user.
   * @param {string} nextUsername - Selected username
   * @returns {void} - Nothing
   */
  const onUserChange = (nextUsername: string): void => {
    if (nextUsername) {
      void navigate(`/permission/assign/${nextUsername}`);
    }
  };

  /**
   * Return to the permission list.
   * @returns {void} - Nothing
   */
  const onCancel = (): void => {
    void navigate("/permission");
  };

  return { ...form, ...save, username, userOptions: users.userOptions, isLoadingUsers: users.isLoadingUsers, onUserChange, onUserSearch: users.onUserSearch, onCancel };
};
