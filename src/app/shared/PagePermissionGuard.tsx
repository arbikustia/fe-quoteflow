import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAllPermissions, usePagePermission } from "@/hooks/usePagePermission";

import type { ApiPermissionMenu } from "@/modules/permission/Permission.type";
import { flattenPermissionMenus } from "@/modules/permission/Permission.util";

import type { PagePermissionGuardProps } from "./PagePermissionGuard.type";

/** Unprotected routes accessible without permission check. */
const PUBLIC_PATHS = new Set(["/", "/login", "/profile", "/master-main", "/document", "/report/main", "/preview"]);

/**
 * Maps sub-routes/child routes to their base feature permission URL.
 * @param {string} pathname - Current location pathname
 * @returns {string} Base permission URL
 */
const _resolvePermissionUrl = (pathname: string): string => {
  const baseMap: Record<string, string> = {
    "/item-checklist": "/item-checklist",
    "/item-return": "/item-return",
    "/note": "/note",
    "/mail": "/mail",
    "/permission": "/permission",
    "/calendar": "/calendar",
    "/activity-log": "/activity-log",
    "/document/quotation": "/document/quotation",
    "/document/invoice": "/document/invoice",
    "/document/payment": "/document/payment",
    "/master-customer": "/master-customer",
    "/master-email-sender": "/master-email-sender",
    "/master-item": "/master-item",
    "/master-category": "/master-category",
    "/master-role": "/master-role",
    "/master-voucher": "/master-voucher",
    "/master-project": "/master-project",
    "/master-service-type": "/master-service-type",
    "/master-order-type": "/master-order-type",
    "/master-payment-method": "/master-payment-method",
    "/master-payment-type": "/master-payment-type",
    "/master-pic": "/master-pic",
    "/master-user": "/master-user",
    "/order": "/order/create",
    "/report": "/report",
    "/return": "/item-return",
  };

  const match = Object.keys(baseMap).find((key) => pathname.startsWith(key));
  return match ? baseMap[match] : pathname;
};

/**
 * Helper to get resolved fallback URL for a user based on their permissions.
 * @param {ApiPermissionMenu[]} menus - User permission menus
 * @returns {string} Fallback URL
 */
const _getFallbackUrl = (menus: ApiPermissionMenu[]): string => {
  const flattened = flattenPermissionMenus(menus);
  const firstAllowed = flattened.find((row) => row.permission.includes("view"));
  return firstAllowed ? firstAllowed.url : "/login";
};

/**
 * Route protection wrapper based on user page permissions.
 * @param {PagePermissionGuardProps} props - Guard props
 * @returns {ReactElement} Rendered child component or redirect
 */
export const PagePermissionGuard = (props: PagePermissionGuardProps): ReactElement => {
  const { pathname } = useLocation();

  const isPublic = PUBLIC_PATHS.has(pathname);
  const targetUrl = _resolvePermissionUrl(pathname);

  const { canView, canCreate, isSuperadmin, isLoading } = usePagePermission(targetUrl);
  const { menus, isLoading: isAllLoading } = useAllPermissions();

  if (isPublic) {
    return props.children;
  }

  if (isLoading || isAllLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-page">
        <p className="text-lg text-text-tertiary">Loading permissions…</p>
      </div>
    );
  }

  if (isSuperadmin) {
    return props.children;
  }

  const fallbackUrl = _getFallbackUrl(menus);

  // Special check for /home when user lacks home permission
  if (pathname === "/home" && !canView) {
    return <Navigate to={fallbackUrl} replace />;
  }

  // Create routes protection check
  const isCreateRoute = pathname.includes("/create") || pathname.includes("/edit");
  const isPermitted = isCreateRoute ? (canCreate || canView) : canView;

  if (!isPermitted) {
    return <Navigate to={fallbackUrl} replace />;
  }

  return props.children;
};
