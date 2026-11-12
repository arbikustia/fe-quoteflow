import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { PROJECT_STATUS_BADGE_CLASS } from "./MasterProject.config";
import type { ProjectData, ProjectMobileCardProps } from "./MasterProject.type";
import { getProjectRowNumber } from "./MasterProject.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {ProjectData} project - Project of the row
 * @param {(project: ProjectData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  project: ProjectData,
  onEdit: (project: ProjectData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(project);
  };
};

/**
 * Render the project name cell.
 * @param {ProjectData} project - Project row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (project: ProjectData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{project.name}</span>
);

/**
 * Render the project remark cell.
 * @param {ProjectData} project - Project row
 * @returns {React.ReactElement} - Remark cell
 */
const _renderRemarkCell = (project: ProjectData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{project.remark}</span>
);

/**
 * Render the project status cell.
 * @param {ProjectData} project - Project row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (project: ProjectData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PROJECT_STATUS_BADGE_CLASS[project.status]}`}>
    {project.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {ProjectData} project - Project row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (project: ProjectData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{project.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {ProjectData} project - Project row
 * @param {(project: ProjectData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (project: ProjectData, onEdit: (project: ProjectData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(project, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit project"
      aria-label={`Edit project ${project.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the project table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit projects
 * @param {(project: ProjectData) => void} onEdit - Edit callback
 * @returns {TableColumn<ProjectData>[]} - Project table columns
 */
export const getProjectColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (project: ProjectData) => void,
): TableColumn<ProjectData>[] => {
  /**
   * Render the row number cell.
   * @param {ProjectData} _project - Project row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_project: ProjectData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getProjectRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {ProjectData} project - Project row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (project: ProjectData): React.ReactElement => _renderActionCell(project, onEdit);

  const columns: TableColumn<ProjectData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Project Name", render: _renderNameCell },
    { key: "remark", header: "Remark", render: _renderRemarkCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of a project.
 * @param {ProjectData} project - Project row
 * @returns {string} - Row key
 */
export const getProjectRowKey = (project: ProjectData): string => project.id;

/**
 * Render a project card for the mobile list; disabled without edit permission.
 * @param {ProjectMobileCardProps} props - Project, edit permission and edit callback
 * @returns {React.ReactElement} - Project card
 */
export const renderProjectMobileCard = (props: ProjectMobileCardProps): React.ReactElement => {
  const { project, canEdit, onEdit } = props;

  return (
    <button
      key={project.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(project, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{project.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PROJECT_STATUS_BADGE_CLASS[project.status]}`}>
          {project.status}
        </span>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-4 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Items</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{project.itemCount} item(s)</span>
        </span>
        <span className="min-w-0 text-right">
          <span className="block text-lg text-text-tertiary">Created At</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{project.createdAt}</span>
        </span>
        <span className="col-span-2 min-w-0 border-t border-border-default pt-4">
          <span className="block text-lg text-text-tertiary">Remark</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{project.remark}</span>
        </span>
      </span>
    </button>
  );
};
