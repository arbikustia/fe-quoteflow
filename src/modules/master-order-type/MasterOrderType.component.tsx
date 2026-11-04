import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { getOrderTypeRowNumber } from "./MasterOrderType.helpers";
import type { MasterOrderTypeProps, OrderTypeData } from "./MasterOrderType.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import { CardSkeletonComponent } from "../../components/Skeleton";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";
import { formatIndonesianDateTime } from "../../utils/date.helpers";

/**
 * Render order type row number.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {number} index - Row index
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (currentPage: number, pageSize: number, index: number): React.ReactElement => (
  <span className="text-lg text-text-secondary">{getOrderTypeRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Render order type status.
 * @param {OrderTypeData} row - Order type row data
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: OrderTypeData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {row.status}
  </span>
);

/**
 * Render order type handover cell.
 * @param {OrderTypeData} row - Order type row data
 * @returns {React.ReactElement} Handover cell
 */
const _renderHandover = (row: OrderTypeData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.isHandover ? "bg-information-subtle text-information-strong" : "bg-background-subtle text-text-secondary"}`}>
    {row.isHandover ? "Yes" : "No"}
  </span>
);

/**
 * Render order type creation date.
 * @param {OrderTypeData} row - Order type row data
 * @returns {React.ReactElement} Date cell
 */
const _renderDate = (row: OrderTypeData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{row.createAt ? formatIndonesianDateTime(row.createAt) : "-"}</span>
);

/**
 * Render order type action cell.
 * @param {OrderTypeData} row - Order type row data
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (row: OrderTypeData, onEdit: (orderType: OrderTypeData) => void): React.ReactElement => {
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit order type" aria-label={`Edit order type ${row.name}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Build order type table columns.
 * @param {MasterOrderTypeProps} props - Component props
 * @returns {TableColumn<OrderTypeData>[]} Order type columns
 */
const _getColumns = (props: MasterOrderTypeProps): TableColumn<OrderTypeData>[] => {
  const renderNumber = (_row: OrderTypeData, index: number): React.ReactElement => _renderNumber(props.currentPage, props.pageSize, index);
  const renderAction = (row: OrderTypeData): React.ReactElement => _renderActions(row, props.onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Order Type Name", render: (row): React.ReactElement => <span className="text-lg font-medium text-text-primary">{row.name}</span> },
    { key: "isHandover", header: "Handover", align: "center", render: _renderHandover },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At", render: _renderDate },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

/**
 * Render loading, empty, and error states.
 * @param {MasterOrderTypeProps} props - The component props
 * @returns {React.ReactElement | null} The state element when no rows should render
 */
const _renderListState = (props: MasterOrderTypeProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-lg text-text-secondary">Loading order types…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-lg text-danger">Order type data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No order types found.</p>;
  return null;
};

/** Render table skeleton. */
const _renderTableSkeleton = (props: MasterOrderTypeProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-52", "w-28", "w-28", "w-28", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading order type table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, columnIndex) => (
                <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
                  {column.key === "actions" ? <div className="flex justify-center"><span className="h-10 w-10 rounded-3xl bg-background-subtle" /></div> : <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Render desktop table. */
const _renderDesktop = (props: MasterOrderTypeProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search order type" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Order Type</button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} keyExtractor={(r: OrderTypeData) => r.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render mobile order type card.
 * @param {OrderTypeData} orderType - Order type data
 * @param {MasterOrderTypeProps["onEdit"]} onEdit - Edit handler
 * @returns {React.ReactElement} Order type card
 */
const _renderMobileCard = (orderType: OrderTypeData, onEdit: MasterOrderTypeProps["onEdit"]): React.ReactElement => {
  const handleClick = (): void => onEdit(orderType);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{orderType.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${orderType.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{orderType.status}</span>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-4 border-t border-border-default pt-4">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Handover</span><span className="mt-1 block text-lg font-medium text-text-primary">{orderType.isHandover ? "Handover Required" : "No Handover"}</span></span>
        <span className="min-w-0 text-right"><span className="block text-lg text-text-tertiary">Created At</span><span className="mt-1 block text-lg font-medium text-text-primary">{orderType.createAt ? formatIndonesianDateTime(orderType.createAt) : "-"}</span></span>
      </span>
    </button>
  );
};

/** Render mobile list. */
const _renderMobile = (props: MasterOrderTypeProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search order type" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? <CardSkeletonComponent count={5} /> : _renderListState(props) ?? props.paginatedData.map((orderType) => <React.Fragment key={orderType.id}>{_renderMobileCard(orderType, props.onEdit)}</React.Fragment>)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

export const MasterOrderTypeComponent = (props: MasterOrderTypeProps): React.ReactElement => {
  const createButton = (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Order Type List">
      <PageLayout title="Order Type List" subtitle="Manage order types and handover rules" breadcrumbs={["Master", "Master Order Type"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
