import type { ReactElement } from "react";

import type { TabsProps } from "./Tabs.type";

export const Tabs = ({ items, activeId, onChange }: TabsProps): ReactElement => (
  <div className="flex items-center gap-6 overflow-x-auto border-b border-border-default" role="tablist">
    {items.map((item) => {
      const isActive = item.id === activeId;
      const handleClick = (): void => onChange(item.id);

      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={handleClick}
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
