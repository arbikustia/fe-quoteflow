import type { ChangeEvent, ReactElement } from "react";

import { formatMailDisplayValue, getMailRowNumber, MailMobileCard } from "./Mail.helpers";
import type { MailData, MailProps } from "./Mail.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

/**
 * Render mail status cell.
 * @param {MailData} row - Mail row data
 * @returns {ReactElement} Status cell
 */
const _renderStatus = (row: MailData): ReactElement => {
  const isActive = row.status === "active";
  const badgeClass = isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";

  return (
    <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${badgeClass}`}>
      {row.status}
    </span>
  );
};

/**
 * Render mail subject cell.
 * @param {MailData} row - Mail row data
 * @returns {ReactElement} Subject cell
 */
const _renderSubject = (row: MailData): ReactElement => <span className="text-lg font-medium">{row.subject}</span>;

/**
 * Render mail recipient cell.
 * @param {MailData} row - Mail row data
 * @returns {ReactElement} Recipient cell
 */
const _renderRecipient = (row: MailData): ReactElement => (
  <span className="text-lg text-text-secondary">{formatMailDisplayValue(row.recipient)}</span>
);

/**
 * Render mail created date cell.
 * @param {MailData} row - Mail row data
 * @returns {ReactElement} Created date cell
 */
const _renderCreatedAt = (row: MailData): ReactElement => <span className="text-lg">{formatMailDisplayValue(row.createAt)}</span>;

/**
 * Get mail row key.
 * @param {MailData} row - Mail row data
 * @returns {string} Row key
 */
const _getMailKey = (row: MailData): string => row.id;

/**
 * Build mail table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @returns {TableColumn<MailData>[]} Mail columns
 */
const _getColumns = (currentPage: number, pageSize: number): TableColumn<MailData>[] => {
  /**
   * Render row number.
   * @param {MailData} _row - Mail row data
   * @param {number} index - Zero-based row index
   * @returns {ReactElement} Number cell
   */
  const renderNumber = (_row: MailData, index: number): ReactElement => (
    <span className="text-lg">{getMailRowNumber(currentPage, pageSize, index)}</span>
  );

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "subject", header: "Subject", render: _renderSubject },
    { key: "recipient", header: "To", render: _renderRecipient },
    { key: "createAt", header: "Created At", render: _renderCreatedAt },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
  ];
};

/**
 * Render mobile mail card skeleton.
 * @param {number} key - Skeleton key
 * @returns {ReactElement} Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading mail card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-40 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="h-7 w-36 rounded-3xl bg-background-subtle" />
      <div className="h-7 w-24 rounded-3xl bg-background-subtle" />
    </div>
  </div>
);

/**
 * Render loading, empty, and error states.
 * @param {MailProps} props - Component props
 * @returns {ReactElement | null} State element when no rows should render
 */
const _renderListState = (props: MailProps): ReactElement | null => {
  const { errorMessage, isEmpty, isMissingData } = props;

  if (isMissingData) return <p className="py-10 text-center text-lg text-text-tertiary">Mail data is unavailable. Please try again.</p>;

  if (errorMessage) return <p className="py-10 text-center text-lg text-text-tertiary">{errorMessage}</p>;

  if (isEmpty) return <p className="py-10 text-center text-lg text-text-tertiary">No mails found.</p>;

  return null;
};

/**
 * Render single skeleton row.
 * @param {TableColumn<MailData>[]} columns - Table columns
 * @param {number} rowIndex - Row index
 * @returns {ReactElement} Skeleton row
 */
const _renderSkeletonRow = (columns: TableColumn<MailData>[], rowIndex: number): ReactElement => (
  <tr key={rowIndex} className="animate-pulse">
    {columns.map((column) => (
      <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block h-5 w-32 rounded-3xl bg-background-subtle align-middle" />
      </td>
    ))}
  </tr>
);

/**
 * Render mail table skeleton.
 * @param {MailProps} props - Component props
 * @returns {ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MailProps): ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize);

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading mail table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{Array.from({ length: 5 }, (_value, rowIndex) => _renderSkeletonRow(columns, rowIndex))}</tbody>
      </table>
    </div>
  );
};

/**
 * Render desktop toolbar with search and compose button.
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} handleSearch - Search change handler
 * @param {() => void} onCompose - Compose handler
 * @returns {ReactElement} Toolbar element
 */
const _renderDesktopToolbar = (handleSearch: (event: ChangeEvent<HTMLInputElement>) => void, onCompose: () => void): ReactElement => (
  <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
    <SearchFilter placeholder="Search mail" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
    <button
      type="button"
      onClick={onCompose}
      className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      Compose Mail
    </button>
  </div>
);

/**
 * Render desktop table view.
 * @param {MailProps} props - Component props
 * @returns {ReactElement} Desktop table element
 */
const _renderDesktopTable = (props: MailProps): ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, onCompose, setSearchTerm, totalCount } = props;
  const columns = _getColumns(currentPage, pageSize);

  /**
   * Handle search input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      {_renderDesktopToolbar(handleSearchChange, onCompose)}
      <div className="flex-1 overflow-auto">
        {props.isLoading ? (
          _renderTableSkeleton(props)
        ) : (
          _renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} keyExtractor={_getMailKey} />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        totalItems={totalCount}
        className="pt-4"
      />
    </div>
  );
};

/**
 * Render mobile mail cards.
 * @param {MailProps} props - Component props
 * @returns {ReactElement} Mobile list element
 */
const _renderMobileCards = (props: MailProps): ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, pageSize, changePageSize, setSearchTerm, totalCount } = props;

  /**
   * Handle mobile search input.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search mail"
        onChange={handleSearchChange}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading
          ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
          : _renderListState(props) ?? paginatedData.map((mail) => <MailMobileCard key={mail.id} mail={mail} />)}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        totalItems={totalCount}
        isCompact={true}
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Mail list component.
 * @param {MailProps} props - Component props
 * @returns {ReactElement} Component element
 */
export const MailComponent = (props: MailProps): ReactElement => {
  const { onBack, onCompose } = props;
  const composeButton = (
    <button
      type="button"
      onClick={onCompose}
      className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
    >
      Compose
    </button>
  );

  return (
    <Layout pageTitle="Mail List">
      <PageLayout
        title="Mail List"
        subtitle="Compose and manage outgoing mails"
        breadcrumbs={["Mail"]}
        headerRight={composeButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileCards(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
