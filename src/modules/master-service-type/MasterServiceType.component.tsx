import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { MasterServiceTypeProps, ServiceTypeData } from "./MasterServiceType.type";

/**
 * Build service type table columns.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {(serviceType: ServiceTypeData) => void} onEdit - Edit handler
 * @returns {TableColumn<ServiceTypeData>[]} Service type columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (serviceType: ServiceTypeData) => void): TableColumn<ServiceTypeData>[] => {
  /**
   * Render row number.
   * @param {ServiceTypeData} _row - Service type row
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNo = (_row: ServiceTypeData, index: number): React.ReactElement => <span className="text-sm font-medium text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>;
  /**
   * Render price.
   * @param {ServiceTypeData} row - Service type row
   * @returns {React.ReactElement} Price cell
   */
  const renderPrice = (row: ServiceTypeData): React.ReactElement => <span>Rp {row.price.toLocaleString("id-ID")}</span>;
  /**
   * Render active state.
   * @param {ServiceTypeData} row - Service type row
   * @returns {React.ReactElement} Active cell
   */
  const renderIsActive = (row: ServiceTypeData): React.ReactElement => <span className={`rounded px-2 py-0.5 text-xs font-semibold ${row.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{row.isActive ? "Yes" : "No"}</span>;
  /**
   * Render status.
   * @param {ServiceTypeData} row - Service type row
   * @returns {React.ReactElement} Status cell
   */
  const renderStatus = (row: ServiceTypeData): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;
  /**
   * Render edit action.
   * @param {ServiceTypeData} row - Service type row
   * @returns {React.ReactElement} Action cell
   */
  const renderActions = (row: ServiceTypeData): React.ReactElement => {
    /**
     * Handle edit click.
     * @param {React.MouseEvent} event - Click event
     * @returns {void} No return value
     */
    const handleClick = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(row);
    };

    return <div className="flex items-center justify-center"><button type="button" onClick={handleClick} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button></div>;
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "name", header: "Service Name", mobile: { primary: true } },
    { key: "price", header: "Price", mobile: { primary: true, render: renderPrice }, render: renderPrice },
    { key: "isActive", header: "Active", align: "center", render: renderIsActive },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At" },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render loading, empty, and error states.
 * @param {MasterServiceTypeProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterServiceTypeProps): React.ReactElement | null => {
  const { isLoading, isMissingData, errorMessage, isEmpty } = props;

  if (isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading service types…</p>;

  if (isMissingData) return <p className="py-10 text-center text-sm text-red-600">Service type data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-sm text-red-600">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No service types found.</p>;

  return null;
};

/**
 * Render mobile service type card.
 * @param {ServiceTypeData} serviceType - Service type data
 * @param {MasterServiceTypeProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Card element
 */
const _renderServiceTypeCard = (serviceType: ServiceTypeData, onEdit: MasterServiceTypeProps["onEdit"]): React.ReactElement => {
  /**
   * Open service type editing.
   * @returns {void} No return value
   */
  const handleEdit = (): void => onEdit(serviceType);

  return (
    <MasterDataCard title={serviceType.name} status={serviceType.status} onClick={handleEdit}>
      <span className="grid gap-2 text-sm text-text-secondary">
        <span>Rp {serviceType.price.toLocaleString("id-ID")}</span>
        <span>{serviceType.isActive ? "Active" : "Inactive"}</span>
      </span>
    </MasterDataCard>
  );
};

/**
 * Render mobile cards view.
 * @param {MasterServiceTypeProps} props - Component props
 * @returns {React.ReactElement} Mobile view
 */
const _renderMobile = (props: MasterServiceTypeProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onEdit } = props;
  /**
   * Update service type search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search service type" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((serviceType) => <React.Fragment key={serviceType.id}>{_renderServiceTypeCard(serviceType, onEdit)}</React.Fragment>)}
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
 * Render desktop table view.
 * @param {MasterServiceTypeProps} props - Component props
 * @returns {React.ReactElement} Desktop view
 */
const _renderDesktop = (props: MasterServiceTypeProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate, onEdit, onRowClick } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);
  /**
   * Update service type search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:mt-6 md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6">
        <SearchFilter placeholder="Search service type" onChange={handleSearch} />
        <button type="button" onClick={onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Service Type</button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={(row: ServiceTypeData) => row.id} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render master service type list.
 * @param {MasterServiceTypeProps} props - Component props
 * @returns {React.ReactElement} List element
 */
export const MasterServiceTypeComponent = (props: MasterServiceTypeProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = <button type="button" onClick={onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return (
    <Layout pageTitle="Service Type List" mobileWhiteBackground={true}>
      <PageLayout title="Service Type List" breadcrumbs={["Master", "Master Service Type"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
