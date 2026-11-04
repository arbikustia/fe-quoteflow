import type { ReactElement } from "react";

import { useActionMenu } from "./ActionMenu.hook";
import type { ActionMenuProps } from "./ActionMenu.type";

/**
 * Render shared three-dot action menu.
 * @param {ActionMenuProps} props - Action menu props
 * @returns {ReactElement} Action menu
 */
export const ActionMenu = (props: ActionMenuProps): ReactElement => {
  const { rootRef } = useActionMenu();

  return (
    <details ref={rootRef} className="relative shrink-0">
      <summary data-testid={props.testId} className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-3xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary" aria-label="More options">
        {props.icon}
      </summary>
      <div role="menu" className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-3xl border border-border-default bg-background-surface py-2 shadow-lg">
        {props.children}
      </div>
    </details>
  );
};
