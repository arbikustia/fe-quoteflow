import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetUsersQuery } from "@/services/master-user.service";
import { useGetUserPermissionQuery, useSaveUserPermissionMutation } from "@/services/permission.service";

import { buildPermissionPayload, getPermissionPages } from "./Permission.form";
import { filterPermissionRows, flattenPermissionMenus } from "./Permission.helpers";
import type { PermissionAction, PermissionFormPage, PermissionState } from "./Permission.type";

/** Merge current API permissions into sidebar page definitions. */
const _mergePermissions = (pages: PermissionFormPage[], rows: PermissionState["rows"]): PermissionFormPage[] => pages.map((page) => {
  const current = rows.find((row) => row.url === page.url);
  const permission = page.actions.filter((action) => current?.permission.includes(action));

  return { ...page, permission };
});

/** Manage permission page data, form, and filters. */
export const usePermissionState = (): PermissionState => {
  const navigate = useNavigate();
  const [selectedUsername, setSelectedUsername] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formPages, setFormPages] = useState<PermissionFormPage[]>(getPermissionPages);
  const [formMessage, setFormMessage] = useState<string>();
  const usersQuery = useGetUsersQuery({ PageNumber: 1, PageSize: 100, SearchTerm: userSearchTerm || undefined });
  const permissionQuery = useGetUserPermissionQuery(selectedUsername, { skip: !selectedUsername });
  const [savePermission, saveState] = useSaveUserPermissionMutation();
  const userOptions = useMemo(() => (usersQuery.data?.data ?? [])
    .filter((user) => Boolean(user.username))
    .map((user) => ({ label: user.username ?? "", value: user.username ?? "" })), [usersQuery.data]);
  const permissionRows = useMemo(() => (
    permissionQuery.data?.status && permissionQuery.data.data
      ? flattenPermissionMenus(permissionQuery.data.data.menus)
      : []
  ), [permissionQuery.data]);
  const rows = useMemo(() => filterPermissionRows(permissionRows, searchTerm), [permissionRows, searchTerm]);
  let errorMessage: string | undefined;

  if (usersQuery.isError) errorMessage = "Unable to load users.";
  else if (permissionQuery.isError || permissionQuery.data?.status === false) errorMessage = "Unable to load permissions.";

  const onUsernameChange = (username: string): void => {
    setSelectedUsername(username);
    setIsFormOpen(false);
    setFormMessage(undefined);
  };

  const onOpenAssign = (): void => {
    navigate(`/permission/assign/${selectedUsername || "all"}`);
  };

  const onPermissionChange = (url: string, permission: PermissionAction, checked: boolean): void => {
    setFormPages((current) => current.map((page) => {
      if (page.url !== url) return page;
      const permissions = checked
        ? [...page.permission, permission].filter((action, index, actions) => actions.indexOf(action) === index)
        : page.permission.filter((action) => action !== permission);

      return { ...page, permission: permissions };
    }));
  };

  const onSubmit = (): void => {
    if (!selectedUsername) return;

    void (async (): Promise<void> => {
      setFormMessage(undefined);
      try {
        const response = await savePermission(buildPermissionPayload(selectedUsername, formPages)).unwrap();
        if (!response.status) throw new Error("Save rejected");
        setFormMessage("Permissions saved successfully.");
        setIsFormOpen(false);
      } catch {
        setFormMessage("Unable to save permissions.");
      }
    })();
  };

  return {
    selectedUsername,
    userOptions,
    rows,
    formPages,
    isFormOpen,
    isLoadingUsers: usersQuery.isLoading,
    isLoadingPermission: permissionQuery.isLoading,
    isSubmitting: saveState.isLoading,
    errorMessage,
    formMessage,
    isEmpty: Boolean(selectedUsername) && !permissionQuery.isLoading && !errorMessage && rows.length === 0,
    searchTerm,
    onUsernameChange,
    onUserSearch: setUserSearchTerm,
    onSearchChange: setSearchTerm,
    onOpenForm: onOpenAssign,
    onCloseForm: (): void => setIsFormOpen(false),
    onPermissionChange,
    onSubmit,
    onBack: (): void => navigate("/home"),
  };
};
