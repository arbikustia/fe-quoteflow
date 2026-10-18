import * as React from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

import type {
  TableActionButtonProps,
  TableActionName,
  TableColumn,
  TableMobileRowProps,
  TableProps,
} from "./Table.type";

const ACTION_CLASS_NAMES: Readonly<Record<TableActionName, string>> = {
  view: "text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle",
  edit: "text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle",
  delete: "text-text-tertiary hover:text-danger hover:bg-danger-subtle",
};

const ACTION_ICONS: Readonly<Record<TableActionName, React.ReactElement>> = {
  view: <FiEye className="w-4 h-4" />,
  edit: <FiEdit2 className="w-4 h-4" />,
  delete: <FiTrash2 className="w-4 h-4" />,
};

const MOBILE_ACTION_ICONS: Readonly<Record<TableActionName, React.ReactElement>> = {
  view: <FiEye className="w-5 h-5" />,
  edit: <FiEdit2 className="w-5 h-5" />,
  delete: <FiTrash2 className="w-5 h-5" />,
};

/**
 * Resolve primitive or element cell value.
 * @param {T} row - Table row
 * @param {string} key - Column key
 * @returns {React.ReactNode} Cell value
 */
const _getCellValue = <T,>(row: T, key: string): React.ReactNode => {
  const entry = Object.entries(Object.assign({}, row)).find(([name]) => name === key);
  const value = entry?.[1];

  if (React.isValidElement(value) || typeof value === "string" || typeof value === "number") {
    return value;
  }

  return null;
};

/**
 * Render action button.
 * @param {TableActionButtonProps<T>} props - Action button props
 * @returns {React.ReactElement} Action button
 */
const _renderActionButton = <T,>(props: TableActionButtonProps<T>): React.ReactElement => {
  const { action, icon, label, row, className } = props;

  /**
   * Handle action click.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void}
   */
  const handleClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    action(row);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${className}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
};

/**
 * Render one configured desktop action.
 * @param {TableColumn<T>} column - Table column
 * @param {T} row - Table row
 * @param {TableActionName} actionName - Action name
 * @returns {React.ReactNode} Action button when configured
 */
const _renderDesktopAction = <T,>(column: TableColumn<T>, row: T, actionName: TableActionName): React.ReactNode => {
  const action = column.actions?.[actionName];

  if (!action) {
    return null;
  }

  const label = `${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;

  return _renderActionButton({
    action,
    className: ACTION_CLASS_NAMES[actionName],
    icon: ACTION_ICONS[actionName],
    label,
    row,
  });
};

/**
 * Render desktop cell content.
 * @param {TableColumn<T>} column - Table column
 * @param {T} row - Table row
 * @param {number} index - Row index
 * @returns {React.ReactNode} Cell content
 */
const _renderCellContent = <T,>(column: TableColumn<T>, row: T, index: number): React.ReactNode => {
  if (column.actions) {
    return (
      <div className="flex items-center justify-center gap-1.5">
        {_renderDesktopAction(column, row, "view")}
        {_renderDesktopAction(column, row, "edit")}
        {_renderDesktopAction(column, row, "delete")}
      </div>
    );
  }

  if (column.render) {
    return column.render(row, index);
  }

  return _getCellValue(row, column.key);
};

/**
 * Render mobile cell content.
 * @param {TableColumn<T>} column - Table column
 * @param {T} row - Table row
 * @returns {React.ReactNode} Cell content
 */
const _renderMobileCellContent = <T,>(column: TableColumn<T>, row: T): React.ReactNode => {
  if (column.mobile?.render) {
    return column.mobile.render(row);
  }

  if (column.render) {
    return column.render(row, 0);
  }

  return _getCellValue(row, column.key);
};

/**
 * Resolve alignment class.
 * @param {"left" | "center" | "right"} [align] - Cell alignment
 * @returns {string} Alignment class
 */
const _getAlignClass = (align?: "left" | "center" | "right"): string => {
  if (align === "right") {
    return "text-right";
  }

  if (align === "center") {
    return "text-center";
  }

  return "text-left";
};

/**
 * Resolve sticky body class.
 * @param {"left" | "right"} [sticky] - Sticky edge
 * @returns {string} Sticky class
 */
const _getStickyClass = (sticky?: "left" | "right"): string => {
  if (sticky === "left") {
    return "sticky left-0 z-10 bg-brand-white dark:bg-background-surface";
  }

  if (sticky === "right") {
    return "sticky right-0 z-10 bg-brand-white dark:bg-background-surface";
  }

  return "";
};

/**
 * Resolve sticky header class.
 * @param {"left" | "right"} [sticky] - Sticky edge
 * @returns {string} Sticky header class
 */
const _getStickyHeaderClass = (sticky?: "left" | "right"): string => {
  if (sticky === "left") {
    return "sticky left-0 z-20 bg-table-header dark:bg-table-header";
  }

  if (sticky === "right") {
    return "sticky right-0 z-20 bg-table-header dark:bg-table-header";
  }

  return "";
};

/**
 * Render desktop table row.
 * @param {T} row - Table row
 * @param {number} index - Row index
 * @param {TableProps<T>} props - Table props
 * @returns {React.ReactElement} Table row
 */
const _renderDesktopRow = <T,>(row: T, index: number, props: TableProps<T>): React.ReactElement => {
  const { columns, isDetail = true, keyExtractor, onRowClick } = props;

  return (
    <tr
      key={keyExtractor(row)}
      onClick={isDetail ? (): void => onRowClick?.(row) : undefined}
      className={`hover:bg-background-subtle/50 transition-colors ${isDetail && onRowClick ? "cursor-pointer" : ""}`}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-5 py-4 border-b border-border-default text-base ${_getAlignClass(column.align)} ${_getStickyClass(column.sticky)}`}
        >
          {_renderCellContent(column, row, index)}
        </td>
      ))}
    </tr>
  );
};

/**
 * Render desktop table body.
 * @param {TableProps<T>} props - Table props
 * @returns {React.ReactElement} Table body content
 */
const _renderDesktopBody = <T,>(props: TableProps<T>): React.ReactElement => {
  const { columns, data, emptyText, isLoading } = props;

  if (isLoading || data.length === 0) {
    return (
      <tr>
        <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary font-medium">
          {isLoading ? "Loading..." : (emptyText ?? "No data available")}
        </td>
      </tr>
    );
  }

  return <>{data.map((row, index) => _renderDesktopRow(row, index, props))}</>;
};

/**
 * Render desktop table.
 * @param {TableProps<T>} props - Table props
 * @returns {React.ReactElement} Desktop table
 */
export const renderDesktopTable = <T,>(props: TableProps<T>): React.ReactElement => (
  <div className="w-full overflow-x-auto">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>
          {props.columns.map((column, index) => (
            <th
              key={column.key}
              className={`bg-table-header px-5 py-4 text-[13px] font-bold text-text-secondary uppercase tracking-widest ${index === 0 ? "rounded-l-xl" : ""} ${index === props.columns.length - 1 ? "rounded-r-xl" : ""} ${_getAlignClass(column.align)} ${_getStickyHeaderClass(column.sticky)}`}
              style={{ width: column.width }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border-default">{_renderDesktopBody(props)}</tbody>
    </table>
  </div>
);

/**
 * Check whether column includes actions.
 * @param {TableColumn<T>} column - Table column
 * @returns {boolean} Whether actions exist
 */
const _hasActions = <T,>(column: TableColumn<T>): boolean => Boolean(
  column.actions?.view || column.actions?.edit || column.actions?.delete
);

/**
 * Render mobile field.
 * @param {TableColumn<T>} column - Table column
 * @param {T} row - Table row
 * @returns {React.ReactElement} Mobile field
 */
const _renderMobileField = <T,>(column: TableColumn<T>, row: T): React.ReactElement => {
  /**
   * Stop action field propagation.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void}
   */
  const handleClick = (event: React.MouseEvent): void => {
    if (_hasActions(column)) {
      event.stopPropagation();
    }
  };

  return (
  <div
    key={column.key}
    className="flex items-center justify-between gap-2"
    onClick={handleClick}
  >
    <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{column.header}</span>
    <span className="flex-1 text-sm font-medium text-text-primary text-right truncate">
      {_renderMobileCellContent(column, row)}
    </span>
  </div>
  );
};

/**
 * Render one configured mobile action.
 * @param {TableColumn<T>} column - Table column
 * @param {T} row - Table row
 * @param {TableActionName} actionName - Action name
 * @returns {React.ReactNode} Mobile action when configured
 */
const _renderMobileAction = <T,>(column: TableColumn<T>, row: T, actionName: TableActionName): React.ReactNode => {
  const action = column.actions?.[actionName];

  if (!action) {
    return null;
  }

  const label = `${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;

  /**
   * Handle mobile action click.
   * @returns {void}
   */
  const handleClick = (): void => action(row);

  return (
    <button
      key={`${column.key}-${actionName}`}
      onClick={handleClick}
      className={`p-2 ${ACTION_CLASS_NAMES[actionName]} rounded-lg transition-colors cursor-pointer`}
      aria-label={label}
      title={label}
    >
      {MOBILE_ACTION_ICONS[actionName]}
    </button>
  );
};

/**
 * Render mobile actions.
 * @param {readonly TableColumn<T>[]} columns - Table columns
 * @param {T} row - Table row
 * @returns {React.ReactNode} Mobile actions
 */
const _renderMobileActions = <T,>(columns: readonly TableColumn<T>[], row: T): React.ReactNode => {
  if (!columns.some(_hasActions)) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
      {columns.map((column) => _renderMobileAction(column, row, "view"))}
      {columns.map((column) => _renderMobileAction(column, row, "edit"))}
      {columns.map((column) => _renderMobileAction(column, row, "delete"))}
    </div>
  );
};

/**
 * Handle mobile row keyboard activation.
 * @param {React.KeyboardEvent} event - Keyboard event
 * @param {T} row - Table row
 * @param {TableProps<T>} props - Table props
 * @returns {void}
 */
const _handleMobileKeyDown = <T,>(event: React.KeyboardEvent, row: T, props: TableProps<T>): void => {
  if (props.isDetail !== false && (event.key === "Enter" || event.key === " ") && props.onRowClick) {
    event.preventDefault();
    props.onRowClick(row);
  }
};

/**
 * Render mobile row.
 * @param {TableMobileRowProps<T>} props - Mobile row props
 * @returns {React.ReactElement} Mobile row
 */
const _renderMobileRow = <T,>(props: TableMobileRowProps<T>): React.ReactElement => {
  const { primaryColumns, row, tableProps } = props;
  const { columns, isDetail = true, keyExtractor, onRowClick } = tableProps;
  const isClickable = Boolean(isDetail && onRowClick);

  /**
   * Handle mobile row click.
   * @returns {void}
   */
  const handleClick = (): void => onRowClick?.(row);

  /**
   * Handle mobile row keyboard activation.
   * @param {React.KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => _handleMobileKeyDown(event, row, tableProps);

  return (
    <div
      key={keyExtractor(row)}
      onClick={isDetail ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-3 px-4 py-4 bg-transparent transition-colors ${isClickable ? "cursor-pointer active:bg-background-subtle/50" : ""}`}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {primaryColumns.map((column) => _renderMobileField(column, row))}
      {_renderMobileActions(columns, row)}
    </div>
  );
};

/**
 * Render mobile cards.
 * @param {TableProps<T>} props - Table props
 * @returns {React.ReactElement} Mobile cards
 */
export const renderMobileCards = <T,>(props: TableProps<T>): React.ReactElement => {
  const { columns, data, emptyText, isLoading } = props;
  const primaryColumns = columns.filter((column) => column.mobile?.primary);

  if (isLoading || data.length === 0) {
    return (
      <div className="py-12 text-center text-base text-text-tertiary font-medium">
        {isLoading ? "Loading..." : (emptyText ?? "No data available")}
      </div>
    );
  }

  return (
    <div className="bg-background-surface overflow-hidden divide-y divide-border-default">
      {data.map((row) => _renderMobileRow({ primaryColumns, row, tableProps: props }))}
    </div>
  );
};
