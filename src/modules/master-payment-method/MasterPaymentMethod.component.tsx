import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterPaymentMethodProps, PaymentMethodData } from "./MasterPaymentMethod.type";

/**
 * Render list state.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterPaymentMethodProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading payment methods…</p>;

  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Payment method data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No payment methods found.</p>;

  return null;
};

/**
 * Render payment method mobile card.
 * @param {PaymentMethodData} paymentMethod - Payment method data
 * @param {MasterPaymentMethodProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Card element
 */
const _renderPaymentMethodCard = (paymentMethod: PaymentMethodData, onEdit: MasterPaymentMethodProps["onEdit"]): React.ReactElement => {
  /**
   * Open payment method editing.
   * @returns {void} No return value
   */
  const handleCardClick = (): void => onEdit(paymentMethod);
  /**
   * Open editing from supported keyboard keys.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Keyboard event
   * @returns {void} No return value
   */
  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") handleCardClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-border-default bg-background-surface p-5 transition-all hover:border-border-strong active:bg-background-subtle/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 truncate text-base font-semibold text-text-primary">{paymentMethod.name}</h4>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${paymentMethod.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {paymentMethod.status}
        </span>
      </div>
      <div className="rounded-xl bg-background-subtle/60 p-3 text-sm">
        <p className="text-xs text-text-tertiary">Description</p>
        <p className="mt-1 font-medium text-text-primary">{paymentMethod.description || "No description"}</p>
      </div>
    </div>
  );
};

/**
 * Render mobile list.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobile = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onEdit } = props;
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search payment method" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((paymentMethod) => (
          <React.Fragment key={paymentMethod.id}>{_renderPaymentMethodCard(paymentMethod, onEdit)}</React.Fragment>
        ))}
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
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Desktop table
 */
const _renderDesktop = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { paginatedData, columns, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate, onRowClick } = props;
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);
  /**
   * Extract payment method row key.
   * @param {PaymentMethodData} row - Payment method row
   * @returns {string} Payment method ID
   */
  const keyExtractor = (row: PaymentMethodData): string => row.id;

  return (
    <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:mt-6 md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6">
        <SearchFilter placeholder="Search payment method" onChange={handleSearch} />
        <button type="button" onClick={onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Payment Method</button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={keyExtractor} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render master payment method page.
 * @param {MasterPaymentMethodProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterPaymentMethodComponent = (props: MasterPaymentMethodProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = <button type="button" onClick={onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return (
    <Layout pageTitle="Payment Method List" mobileWhiteBackground={true}>
      <PageLayout title="Payment Method List" breadcrumbs={["Master", "Master Payment Method"]} headerRight={createButton} mobileHeaderClassName="px-6" onBack={onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
