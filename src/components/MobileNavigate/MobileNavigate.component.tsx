import type { MouseEvent, ReactElement } from "react";

import type { MobileNavigateProps, MobileNavigateResolvedItem } from "./MobileNavigate.type";

/**
 * Render one mobile navigation item.
 * @param {MobileNavigateResolvedItem} item - Navigation item
 * @param {(event: MouseEvent<HTMLButtonElement>) => void} onClick - Click handler
 * @returns {ReactElement} Navigation item
 */
const _renderNavItem = (
  item: MobileNavigateResolvedItem,
  onClick: (event: MouseEvent<HTMLButtonElement>) => void,
): ReactElement => (
  <button
    key={item.id}
    type="button"
    data-path={item.id}
    onClick={onClick}
    className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${item.isActive ? "bg-background-surface text-action-primary shadow-sm" : "text-text-tertiary hover:bg-background-subtle hover:text-text-primary"}`}
    aria-label={item.label}
    aria-current={item.isActive ? "page" : undefined}
  >
    <item.Icon />
    <span className="text-[11px] font-semibold leading-4">{item.label}</span>
  </button>
);

/**
 * Render modern mobile bottom navigation.
 * @param {MobileNavigateProps} props - Component props
 * @returns {ReactElement | null} Navigation bar
 */
export const MobileNavigateComponent = (props: MobileNavigateProps): ReactElement | null => {
  const { items, onNavigate, isHidden } = props;

  /**
   * Navigate to selected tab.
   * @param {MouseEvent<HTMLButtonElement>} event - Button click event
   * @returns {void} No return value
   */
  const handleNavigate = (event: MouseEvent<HTMLButtonElement>): void => {
    const path = event.currentTarget.dataset.path;

    if (path) {
      onNavigate(path);
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-50 rounded-3xl border border-border-default bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.16)] lg:hidden"
      aria-label="Main mobile navigation"
    >
      <div className="flex items-center gap-2">
        {items.map((item) => _renderNavItem(item, handleNavigate))}
      </div>
    </nav>
  );
};

export default MobileNavigateComponent;
