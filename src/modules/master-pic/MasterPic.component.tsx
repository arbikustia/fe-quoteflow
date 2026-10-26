import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { MasterPicProps, PicData } from "./MasterPic.type";

/**
 * Build PIC table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {(pic: PicData) => void} onEdit - Edit action
 * @returns {TableColumn<PicData>[]} PIC columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (pic: PicData) => void): TableColumn<PicData>[] => {
  /**
   * Render row number.
   * @param {PicData} _row - PIC row
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNo = (_row: PicData, index: number): React.ReactElement => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>;
  /**
   * Render status.
   * @param {PicData} row - PIC row
   * @returns {React.ReactElement} Status cell
   */
  const renderStatus = (row: PicData): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;
  /**
   * Render edit action.
   * @param {PicData} row - PIC row
   * @returns {React.ReactElement} Action cell
   */
  const renderActions = (row: PicData): React.ReactElement => {
    /**
     * Handle edit click.
     * @param {React.MouseEvent} event - Mouse event
     * @returns {void} No return value
     */
    const handleEdit = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(row);
    };

    return <button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button>;
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "name", header: "PIC Name", mobile: { primary: true } },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At" },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render list state.
 * @param {MasterPicProps} props - Component props
 * @returns {React.ReactElement | null} State element
 */
const _renderListState = (props: MasterPicProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading PICs…</p>;

  if (props.isError) return <p role="alert" className="py-10 text-center text-sm text-red-700">Unable to load PICs.</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No PICs found.</p>;

  return null;
};

/**
 * Render PIC mobile card.
 * @param {PicData} pic - PIC data
 * @param {MasterPicProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Card element
 */
const _renderPicCard = (pic: PicData, onEdit: MasterPicProps["onEdit"]): React.ReactElement => {
  /**
   * Handle card click.
   * @returns {void} No return value
   */
  const handleCardClick = (): void => {
    onEdit(pic);
  };

  return (
    <MasterDataCard title={pic.name} status={pic.status} isLargeText={true} onClick={handleCardClick}>
      <span className="text-xl text-text-secondary">Created {pic.createAt ?? "-"}</span>
    </MasterDataCard>
  );
};

/**
 * Render mobile list.
 * @param {MasterPicProps} props - Component props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobile = (props: MasterPicProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onEdit } = props;
  /**
   * Handle search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search PIC" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ?? paginatedData.map((pic) => <React.Fragment key={pic.id}>{_renderPicCard(pic, onEdit)}</React.Fragment>)}
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
 * @param {MasterPicProps} props - Component props
 * @returns {React.ReactElement} Desktop table
 */
const _renderDesktop = (props: MasterPicProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, pageSize, totalCount, goToPage, changePageSize, setSearchTerm, onCreate, onRowClick, onEdit } = props;
  const columns = _getColumns(currentPage, pageSize, onEdit);
  /**
   * Handle search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);
  /**
   * Extract PIC row key.
   * @param {PicData} row - PIC row
   * @returns {string} Row ID
   */
  const keyExtractor = (row: PicData): string => row.id;

  return (
    <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:mt-6 md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 py-6">
        <SearchFilter placeholder="Search PIC" onChange={handleSearch} />
        <button type="button" onClick={onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create PIC</button>
      </div>
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? <Table data={paginatedData} columns={columns} isDetail={false} onRowClick={onRowClick} keyExtractor={keyExtractor} />}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} totalItems={totalCount} />
    </div>
  );
};

/**
 * Render master PIC page.
 * @param {MasterPicProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterPicComponent = (props: MasterPicProps): React.ReactElement => {
  const { onBack, onCreate } = props;
  const createButton = <button type="button" onClick={onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return (
    <Layout pageTitle="PIC List" mobileWhiteBackground={true}>
      <PageLayout title="PIC List" breadcrumbs={["Master", "Master PIC"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
