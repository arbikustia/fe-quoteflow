import * as React from "react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetUsersQuery } from "@/services/master-user.service";
import { useGetUserPermissionQuery, useSaveUserPermissionMutation } from "@/services/permission.service";

import { PermissionAssignComponent } from "./PermissionAssign.component";
import { buildPermissionPayload, getPermissionPages } from "../Permission.form";
import { flattenPermissionMenus } from "../Permission.helpers";
import type { PermissionAction, PermissionFormPage } from "../Permission.type";

const PermissionAssignContainer = (): React.ReactElement => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const usersQuery = useGetUsersQuery({ PageNumber: 1, PageSize: 100, SearchTerm: userSearchTerm || undefined });
  const permissionQuery = useGetUserPermissionQuery(username === "all" ? "" : (username ?? ""), { skip: !username || username === "all" });
  const [savePermission, saveState] = useSaveUserPermissionMutation();
  const [formPages, setFormPages] = useState<PermissionFormPage[]>(getPermissionPages());
  const userOptions = useMemo(() => (usersQuery.data?.data ?? [])
    .filter((user) => Boolean(user.username))
    .map((user) => ({ label: user.username ?? "", value: user.username ?? "" })), [usersQuery.data]);

  React.useEffect(() => {
    const timeout = window.setTimeout((): void => {
      if (!permissionQuery.data?.status || !permissionQuery.data.data) {
        setFormPages(getPermissionPages());
        return;
      }

      const rows = flattenPermissionMenus(permissionQuery.data.data.menus);
      setFormPages(getPermissionPages().map((page): PermissionFormPage => {
        const current = rows.find((row) => row.url === page.url);
        const permission = page.actions.filter((action) => current?.permission.includes(action));

        return { ...page, permission };
      }));
    }, 0);

    return (): void => window.clearTimeout(timeout);
  }, [permissionQuery.data, username]);

  const onUserChange = (newUsername: string): void => {
    if (!newUsername) return;
    navigate(`/permission/assign/${newUsername}`);
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

  const selectedCount = formPages.reduce((total, page) => total + page.permission.length, 0);
  const totalCount = formPages.reduce((total, page) => total + page.actions.length, 0);
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  const onSelectAllChange = (checked: boolean): void => {
    setFormPages((current) => current.map((page) => ({ ...page, permission: checked ? [...page.actions] : [] })));
  };

  const onRowSelectChange = (url: string, checked: boolean): void => {
    setFormPages((current) => current.map((page) => (page.url === url ? { ...page, permission: checked ? [...page.actions] : [] } : page)));
  };

  const onSubmit = async (): Promise<void> => {
    if (!username || username === "all") return;

    try {
      await savePermission(buildPermissionPayload(username, formPages)).unwrap();
      navigate("/permission", { state: { message: "Permissions saved successfully." } });
    } catch {
      // handle error
    }
  };

  return (
    <PermissionAssignComponent
      username={username ?? ""}
      formPages={formPages}
      isSubmitting={saveState.isLoading}
      userOptions={userOptions}
      isLoadingUsers={usersQuery.isLoading}
      isAllSelected={isAllSelected}
      isPartiallySelected={selectedCount > 0 && !isAllSelected}
      onSelectAllChange={onSelectAllChange}
      onRowSelectChange={onRowSelectChange}
      onUserChange={onUserChange}
      onUserSearch={setUserSearchTerm}
      onPermissionChange={onPermissionChange}
      onSubmit={onSubmit}
      onCancel={() => navigate("/permission")}
    />
  );
};

export default PermissionAssignContainer;
