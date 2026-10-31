export type ActivityAction = "create" | "edit" | "delete" | "view";

export type ActivityLogPayload = {
  user_name: string;
  action: ActivityAction;
  page: string;
  description: string;
};

export type MasterActivityBody = {
  name?: string;
  category_name?: string;
  role?: string;
  username?: string;
  email?: string;
};

export type ActivityApiResponse = {
  status?: boolean;
};

export type UseActivityLogResult = {
  logActivity: (action: ActivityAction, description: string) => Promise<void>;
};
