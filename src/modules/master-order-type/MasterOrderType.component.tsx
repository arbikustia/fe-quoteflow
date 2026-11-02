import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { getOrderTypeRowNumber, OrderTypeMobileCard } from "./MasterOrderType.helpers";
import type { MasterOrderTypeProps, OrderTypeData } from "./MasterOrderType.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import { CardSkeletonComponent, SkeletonComponent } from "../../components/Skeleton";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

/**
 * Render order type status cell.
 * @param {OrderTypeData} row - Order type row data
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (row: OrderTypeData): React.ReactElement => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
    {row.status}
  </span>
);

/**
 * Render order type handover cell.
 * @param {OrderTypeData} row - Order type row data
 * @returns {React.ReactElement} Handover cell
 */
const _renderHandover = (row: OrderTypeData): React.ReactElement => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.isHandover ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
    {row.isHandover ? "Yes" : "No"}
  </span>
);

/**
 * Render order type action cell.
 * @param {OrderTypeData} row - Order type row data
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (row: OrderTypeData, onEdit: (orderType: OrderTypeData) => void): React.ReactElement => {
  /**
   * Handle edit button.
   * @param {React.MouseEvent} event - Mouse event
   * @returns {void} No return value
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue"
      title="Edit"
    >
      <FiEdit2 className="h-4 w-4" />
    </button>
  );
};

/**
 * Render order type row number cell.
 * @param {OrderTypeData} _row - Order type row data
 * @param {number} index - Zero-based row index
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (_row: OrderTypeData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-sm">{getOrderTypeRowNumber(currentPage, pageSize, index)}</span>
);

/**
 * Build order type table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(orderType: OrderTypeData) => void} onEdit - Edit handler
 * @returns {TableColumn<OrderTypeData>[]} Order type columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (orderType: OrderTypeData) => void): TableColumn<OrderTypeData>[] => {
  const renderNumber = (row: OrderTypeData, index: number): React.ReactElement => _renderNumber(row, index, currentPage, pageSize);
  const renderAction = (row: OrderTypeData): React.ReactElement => _renderActions(row, onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Order Type Name" },
    { key: "isHandover", header: "Handover", align: "center", render: _renderHandover },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "actions", header: "Action", align: "center", render: renderAction },
  ];
};

/**
 * Render loading, empty, and error states.
 * @param {MasterOrderTypeProps} props - The component props
 * @returns {React.ReactElement | null} The state element when no rows should render
 */
const _renderListState = (props: MasterOrderTypeProps): React.ReactElement | null => {
  const { isLoading, errorMessage, isEmpty, isMissingData } = props;

  if (isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading order types…</p>;
  if (isMissingData) return <p className="py-10 text-center text-sm text-red-600">Order type data is unavailable. Please try again.</p>;
  if (errorMessage) return <p className="py-10 text-center text-sm text-red-600">{errorMessage}</p>;
  if (isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No order types found.</p>;

  return null;
};

/**
 * Render desktop table view
 * @param {MasterOrderTypeProps} props - The component props
 * @returns {React.ReactElement} The desktop table element
 */
const _renderDesktopTable = (props: MasterOrderTypeProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onRowClick, onCreate, setSearchTerm, totalCount, onEdit } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6 border-brand-gray-light">
        <SearchFilter placeholder="Search order type" onChange={handleSearchChange} />
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          Create Order Type
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? (
          <SkeletonComponent rows={5} columns={[{ width: "8%" }, { width: "42%" }, { width: "20%" }, { width: "20%" }, { width: "10%" }]} />
        ) : (
          _renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={(r: OrderTypeData) => r.id} />
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render mobile search.
 * @param {MasterOrderTypeProps["setSearchTerm"]} setSearchTerm - Search callback
 * @returns {React.ReactElement} Search field
 */
const _renderMobileSearch = (setSearchTerm: MasterOrderTypeProps["setSearchTerm"]): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return <SearchFilter placeholder="Search order type" onChange={handleSearchChange} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />;
};

/**
 * Render mobile order type cards list view
 * @param {MasterOrderTypeProps} props - The component props
 * @returns {React.ReactElement} The mobile list element
 */
const _renderMobileCards = (props: MasterOrderTypeProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount, onEdit } = props;

  return (
    <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
      <div className="w-full">{_renderMobileSearch(setSearchTerm)}</div>
      <div className="min-w-0 space-y-3">
        {props.isLoading ? (
          <CardSkeletonComponent count={5} />
        ) : (
          _renderListState(props) ?? paginatedData.map((orderType) => (
            <OrderTypeMobileCard key={orderType.id} orderType={orderType} onEdit={onEdit} />
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        totalItems={totalCount}
        isCompact={true}
        className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs"
      />
    </div>
  );
};

/**
 * Master Order Type Component
 * @param {MasterOrderTypeProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterOrderTypeComponent = (props: MasterOrderTypeProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = (
    <button
      type="button"
      onClick={onCreate}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Order Type List" mobileWhiteBackground={true}>
      <PageLayout
        title="Order Type List"
        subtitle="Manage order types and handover rules"
        breadcrumbs={["Master", "Master Order Type"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
