import type { MouseEvent, ReactElement } from "react";

import type { MobileNavigateProps, MobileNavigateResolvedItem } from "./MobileNavigate.type";

/**
 * Get active navigation indicator position.
 * @param {MobileNavigateResolvedItem[]} items - resolved navigation items
 * @returns {number} Active item index
 */
const _getActiveIndicatorIndex = (items: MobileNavigateResolvedItem[]): number => {
  const activeIndex = items.findIndex((item) => item.isActive);

  return activeIndex < 0 ? 0 : activeIndex;
};

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
    className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-3 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${item.isActive ? "text-action-primary" : "text-gray-600 hover:bg-background-subtle hover:text-gray-700"}`}
    aria-label={item.label}
    aria-current={item.isActive ? "page" : undefined}
  >
    <span className="relative z-10 transition-transform duration-300 [&_svg]:h-8 [&_svg]:w-8"><item.Icon /></span>
    <span className="relative z-10 text-base font-semibold leading-6 text-text-primary">{item.label}</span>
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
      className="fixed bottom-4 left-4 right-4 z-50 flex min-h-24 items-end overflow-hidden rounded-3xl border border-border-default bg-white px-4 shadow-[0_12px_32px_rgba(15,23,42,0.16)] lg:hidden"
      aria-label="Main mobile navigation"
    >
      <div className="relative flex w-full items-end">
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-10 w-1/4 bg-gradient-to-t from-action-primary/20 via-action-primary/5 to-transparent transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${_getActiveIndicatorIndex(items) * 100}%)` }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-1/4 bg-action-primary transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${_getActiveIndicatorIndex(items) * 100}%)` }}
          aria-hidden="true"
        />
        {items.map((item) => _renderNavItem(item, handleNavigate))}
      </div>
    </nav>
  );
};

export default MobileNavigateComponent;
