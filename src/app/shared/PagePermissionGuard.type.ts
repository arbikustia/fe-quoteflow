import type { ReactElement } from "react";

export type PagePermissionGuardProps = {
  children: ReactElement;
};

export type PermissionActionState = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  isLoading: boolean;
};
