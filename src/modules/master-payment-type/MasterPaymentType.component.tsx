import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { GetColumnsParams, MasterPaymentTypeProps, PaymentTypeData } from "./MasterPaymentType.type";

/**
 * Get columns for master payment type table
 * @param {GetColumnsParams} params - The parameters for generating columns
 * @returns {TableColumn<PaymentTypeData>[]} The table columns
 */
const _getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<PaymentTypeData>[] => {
  /**
   * Render number column
   * @param {PaymentTypeData} _row - The row data
   * @param {number} index - The row index
   * @returns {React.ReactElement} The number cell
   */
  const renderNo = (_row: PaymentTypeData, index: number): React.ReactElement => (
    <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
  );

  /**
   * Render status column
   * @param {PaymentTypeData} row - The row data
   * @returns {React.ReactElement} The status cell
   */
  const renderStatus = (row: PaymentTypeData): React.ReactElement => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
      {row.status}
    </span>
  );

  /**
   * Render actions column
   * @param {PaymentTypeData} row - The row data
   * @returns {React.ReactElement} The actions cell
   */
  const renderActions = (row: PaymentTypeData): React.ReactElement => {
    /**
     * Handle edit
     * @param {React.MouseEvent} e - The mouse event
     * @returns {void}
     */
    const handleEdit = (e: React.MouseEvent): void => {
      e.stopPropagation();
      onEdit(row);
    };

    return (
      <button
        type="button"
        onClick={handleEdit}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    );
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "name", header: "Payment Type Name", mobile: { primary: true } },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At" },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render list state.
 * @param {MasterPaymentTypeProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterPaymentTypeProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading payment types…</p>;

  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Payment type data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No payment types found.</p>;

  return null;
};

/**
 * Render payment type mobile card.
 * @param {PaymentTypeData} paymentType - Payment type data
 * @param {MasterPaymentTypeProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Card element
 */
const _renderPaymentTypeCard = (paymentType: PaymentTypeData, onEdit: MasterPaymentTypeProps["onEdit"]): React.ReactElement => {
  /**
   * Open payment type editing.
   * @returns {void} No return value
   */
  const handleCardClick = (): void => onEdit(paymentType);

  return (
    <MasterDataCard title={paymentType.name} status={paymentType.status} isLargeText={true} onClick={handleCardClick}>
      <span className="text-xl text-text-secondary">Created {paymentType.createAt ?? "-"}</span>
    </MasterDataCard>
  );
};

/**
 * Render mobile list.
 * @param {MasterPaymentTypeProps} props - Component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobile = (props: MasterPaymentTypeProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onEdit } = props;
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search payment type" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((paymentType) => <React.Fragment key={paymentType.id}>{_renderPaymentTypeCard(paymentType, onEdit)}</React.Fragment>)}
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
 * Render desktop table.
 * @param {MasterPaymentTypeProps} props - Component props
 * @returns {React.ReactElement} Desktop table
 */
const _renderDesktop = (props: MasterPaymentTypeProps): React.ReactElement => {
  const { paginatedData, onEdit, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate } = props;
  const columns = _getColumns({ currentPage, pageSize, onEdit });
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);
  /**
   * Extract payment type row key.
   * @param {PaymentTypeData} row - Payment type row
   * @returns {string} Payment type ID
   */
  const keyExtractor = (row: PaymentTypeData): string => row.id;

  return (
    <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:mt-6 md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6">
        <SearchFilter placeholder="Search payment type" onChange={handleSearch} />
        <button type="button" onClick={onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Payment Type</button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onEdit} keyExtractor={keyExtractor} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render master payment type page.
 * @param {MasterPaymentTypeProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterPaymentTypeComponent = (props: MasterPaymentTypeProps): React.ReactElement => {
  const { onBack } = props;

  return (
    <Layout pageTitle="Payment Type List" mobileWhiteBackground={true}>
      <PageLayout title="Payment Type List" breadcrumbs={["Master", "Master Payment Type"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
