import type { PermissionState } from "@/modules/permission/Permission.type";

export const MOCK_PERMISSION_PROPS: PermissionState = {
  selectedUsername: "admin",
  userOptions: [{ label: "admin", value: "admin" }],
  rows: [{ id: "Document-/quotation-Quotation", menu: "Document", page: "Quotation", url: "/quotation", permission: ["view", "create"] }],
  isLoadingUsers: false,
  isLoadingPermission: false,
  isEmpty: false,
  onUsernameChange: jest.fn(),
  onUserSearch: jest.fn(),
  onSearchChange: jest.fn(),
  onOpenForm: jest.fn(),
  onBack: jest.fn(),
};
