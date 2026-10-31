import { useCallback } from "react";

import { useCreateActivityLogMutation } from "@/services/activity-log.service";

import type { ActivityAction, UseActivityLogResult } from "@/types/activity-log.type";

/** Send non-blocking activity logs for master data actions. */
export const useActivityLog = (page: string, userName: string): UseActivityLogResult => {
  const [createActivityLog] = useCreateActivityLogMutation();
  const logActivity = useCallback(async (action: ActivityAction, description: string): Promise<void> => {
    try {
      await createActivityLog({ user_name: userName, action, page, description }).unwrap();
    } catch {
      // Activity logging must not block master-data operations.
    }
  }, [createActivityLog, page, userName]);

  return { logActivity };
};
