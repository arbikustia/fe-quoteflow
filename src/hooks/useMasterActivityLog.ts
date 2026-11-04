import { useCallback, useRef } from "react";

import { useCreateActivityLogMutation } from "@/services/activity-log.service";
import type { ActivityAction } from "@/types/activity-log.type";

const getUserName = (): string => {
  const cookie = document.cookie.split("; ").find((value) => value.startsWith("quoteflow_username="));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "string";
};

export const useMasterActivityLog = (page: string): {
  logCreate: (name: string) => Promise<void>;
  logEdit: (name: string) => Promise<void>;
  logDelete: (name: string) => Promise<void>;
  logView: () => Promise<void>;
} => {
  const [createActivityLog] = useCreateActivityLogMutation();
  const hasLoggedViewRef = useRef(false);

  const logAction = useCallback(async (action: ActivityAction, description: string): Promise<void> => {
    try {
      await createActivityLog({
        user_name: getUserName(),
        action,
        page,
        description,
      }).unwrap();
    } catch {
      // Activity log non-blocking
    }
  }, [createActivityLog, page]);

  const logCreate = useCallback((name: string): Promise<void> => logAction("create", `melakukan create data ${page} name: ${name}`), [logAction, page]);
  const logEdit = useCallback((name: string): Promise<void> => logAction("edit", `melakukan edit data ${page} name: ${name}`), [logAction, page]);
  const logDelete = useCallback((name: string): Promise<void> => logAction("delete", `melakukan delete data ${page} name: ${name}`), [logAction, page]);
  const logView = useCallback(async (): Promise<void> => {
    if (hasLoggedViewRef.current) return;
    hasLoggedViewRef.current = true;
    await logAction("view", `melihat page ${page}`);
  }, [logAction, page]);

  return {
    logCreate,
    logEdit,
    logDelete,
    logView,
  };
};
