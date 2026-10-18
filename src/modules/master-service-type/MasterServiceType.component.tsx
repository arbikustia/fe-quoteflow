import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterServiceTypeProps, ServiceTypeData } from "./MasterServiceType.type";

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
  const { paginatedData, columns, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate, onRowClick } = props;
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
