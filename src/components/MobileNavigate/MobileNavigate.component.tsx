import * as React from "react";

import type { MobileNavigateProps, MobileNavigateResolvedItem } from "./MobileNavigate.type";

/**
 * Render a single navigation item button.
 * @param {MobileNavigateResolvedItem} item - resolved navigation item
 * @param {React.MouseEventHandler<HTMLButtonElement>} onClick - click handler
 * @returns {React.ReactElement} navigation button
 */
const _renderNavItem = (
  item: MobileNavigateResolvedItem,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
): React.ReactElement => (
  <button
    key={item.id}
    type="button"
    data-path={item.id}
    onClick={onClick}
    className={`relative flex h-14 w-14 flex-col items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${item.isActive ? "text-text-inverse" : "text-text-tertiary hover:text-text-primary"}`}
    aria-label={item.label}
    aria-current={item.isActive ? "page" : undefined}
  >
    <div
      className={`absolute top-0 h-12 w-12 rounded-full bg-action-primary transition-all duration-300 ${item.isActive ? "-translate-y-4 scale-100 opacity-100" : "scale-0 opacity-0"}`}
    ></div>
    <div className={`relative z-10 mb-3 transition-transform duration-300 ${item.isActive ? "-translate-y-4 scale-110" : "scale-100"}`}>
      <item.Icon />
    </div>
    <span className={`absolute bottom-0.5 text-[11px] font-medium ${item.isActive ? "text-text-primary" : "text-text-tertiary"}`}>
      {item.label}
    </span>
  </button>
);

/**
 * MobileNavigate component — pure UI for bottom navigation bar.
 * @param {MobileNavigateProps} props - component props
 * @returns {React.ReactElement | null} mobile navigation bar
 */
export const MobileNavigateComponent = (props: MobileNavigateProps): React.ReactElement | null => {
  const { items, onNavigate, isHidden } = props;

  /**
   * Navigate to selected tab.
   * @param {React.MouseEvent<HTMLButtonElement>} event - button click event
   * @returns {void} No return value
   */
  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>): void => {
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
      className="fixed bottom-0 left-6 right-6 z-50 flex items-center justify-around rounded-t-[2rem] border border-border-default bg-background-elevated px-2 pb-[env(safe-area-inset-bottom)] pt-3 shadow-[0_16px_40px_rgba(15,23,42,0.18)] lg:hidden"
      aria-label="Main mobile navigation"
    >
      {items.map((item) => _renderNavItem(item, handleNavigate))}
    </nav>
  );
};

export default MobileNavigateComponent;
