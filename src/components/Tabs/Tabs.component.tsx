import type { ReactElement } from "react";

import type { TabItem, TabsProps } from "./Tabs.type";

/**
 * Create tab click handler.
 * @param {TabItem} item - Tab item
 * @param {(id: string) => void} onChange - Tab change handler
 * @returns {() => void} Tab click handler
 */
const _getTabClickHandler = (item: TabItem, onChange: (id: string) => void): (() => void) => (): void => onChange(item.id);

/**
 * Render tabs.
 * @param {TabsProps} props - Tabs props
 * @returns {ReactElement} Tabs component
 */
export const Tabs = ({ items, activeId, onChange }: TabsProps): ReactElement => (
  <div className="flex items-center gap-6 overflow-x-auto border-b border-border-default" role="tablist">
    {items.map((item) => {
      const isActive = item.id === activeId;

      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={_getTabClickHandler(item, onChange)}
          className={`flex shrink-0 items-center gap-2 border-b-2 py-4 text-sm transition-colors ${isActive ? "border-action-primary font-semibold text-action-primary" : "border-transparent font-medium text-text-secondary hover:text-text-primary"}`}
        >
          {item.icon}
          {item.label}
          {item.count !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-action-primary/10 text-action-primary" : "bg-background-subtle text-text-secondary"}`}>{item.count}</span>}
        </button>
      );
    })}
  </div>
);
