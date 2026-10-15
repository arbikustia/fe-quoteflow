import { useCallback, useState } from "react";

export type UseSidebarCollapse = {
  readonly isSidebarCollapsed: boolean;
  readonly onToggleSidebarCollapsed: () => void;
};

/**
 * Manage sidebar collapsed state shared by desktop layout controls.
 * @returns {UseSidebarCollapse} sidebar state and toggle handler
 */
export const useSidebarCollapse = (): UseSidebarCollapse => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const onToggleSidebarCollapsed = useCallback((): void => {
    setIsSidebarCollapsed((isCollapsed: boolean) => !isCollapsed);
  }, []);

  return {
    isSidebarCollapsed,
    onToggleSidebarCollapsed,
  };
};
