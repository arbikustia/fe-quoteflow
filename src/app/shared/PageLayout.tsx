import * as React from "react";

import type { PageLayoutAction, PageLayoutProps } from "./PageLayout.type";

const _renderBackIcon = (): React.ReactElement => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

/**
 * Render action menu items.
 * @param {PageLayoutAction[]} actions - page actions
 * @returns {React.ReactElement[]} action buttons
 */
const _renderActions = (actions: PageLayoutAction[]): React.ReactElement[] => actions.map((action: PageLayoutAction) => (
  <button
    key={action.label}
    type="button"
    role="menuitem"
    onClick={action.onClick}
    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-background-subtle ${action.isDangerous ? "text-danger hover:bg-danger-subtle" : "text-text-primary"}`}
  >
    {action.label}
  </button>
));

/**
 * Render reusable responsive page layout.
 * @param {PageLayoutProps} props - page layout props
 * @returns {React.ReactElement} page layout
 */
export const PageLayout = ({ title, breadcrumbs, actions = [], headerRight, mobileHeaderClassName = "px-2", mobileTitleClassName = "", onBack, children, footer }: PageLayoutProps): React.ReactElement => (
  <div className="flex min-h-full flex-col">
    <header className="mb-6 shrink-0">
      <div className="hidden items-start justify-between gap-4 lg:flex">
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-[15px] font-medium text-text-secondary">
              {breadcrumbs.map((breadcrumb: string, index: number) => (
                <React.Fragment key={breadcrumb}>
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {index === 0 ? (
                    <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">
                      {breadcrumb}
                    </button>
                  ) : (
                    <span>{breadcrumb}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="truncate text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h1>
        </div>
        {actions.length > 0 && (
          <details className="relative shrink-0">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border-default text-text-secondary hover:bg-background-subtle" aria-label="More options">
              <span aria-hidden="true">•••</span>
            </summary>
            <div role="menu" className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-lg border border-border-default bg-background-surface py-1 shadow-lg">
              {_renderActions(actions)}
            </div>
          </details>
        )}
      </div>

      <div className={`flex items-center justify-between gap-3 lg:hidden ${mobileHeaderClassName}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button type="button" onClick={onBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default text-text-primary bg-white hover:bg-background-subtle transition-colors">
            {_renderBackIcon()}
          </button>
          <h1 className={`min-w-0 truncate text-left text-3xl font-semibold tracking-tight text-text-primary ${mobileTitleClassName}`}>{title}</h1>
        </div>
        {headerRight ? (
          <div className="shrink-0">{headerRight}</div>
        ) : actions.length > 0 ? (
          <details className="relative shrink-0">
            <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-2xl border border-border-default text-text-secondary hover:bg-background-subtle" aria-label="More options">
              <span aria-hidden="true">•••</span>
            </summary>
            <div role="menu" className="absolute right-0 top-14 z-20 w-48 overflow-hidden rounded-lg border border-border-default bg-background-surface py-1 shadow-lg">
              {_renderActions(actions)}
            </div>
          </details>
        ) : <span className="h-12 w-12 shrink-0" aria-hidden="true" />}
      </div>
    </header>
    <main className="min-w-0 flex-1">{children}</main>
    {footer && <footer className="mt-6 shrink-0">{footer}</footer>}
  </div>
);

export default PageLayout;
