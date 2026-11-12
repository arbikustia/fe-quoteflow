import { z } from "zod";

import type { ProjectListQueryState, ProjectListStatus, ProjectListView } from "./MasterProject.type";
import { ProjectListItemSchema } from "./MasterProject.type";

const ProjectListSchema = z.array(ProjectListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {ProjectListStatus} listStatus - List state to render
 * @returns {ProjectListView} - List view without rows
 */
const _createEmptyListView = (listStatus: ProjectListStatus): ProjectListView => ({
  listStatus,
  projects: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged project query into list view data (single upstream fallback).
 * @param {ProjectListQueryState} queryState - RTK Query data and flags
 * @returns {ProjectListView} - Normalized list view data
 */
export const normalizeProjectList = (queryState: ProjectListQueryState): ProjectListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedProjects = ProjectListSchema.safeParse(data?.data);

  if (!data || !parsedProjects.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedProjects.data.length === 0 ? "empty" : "ready",
    projects: parsedProjects.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a project table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getProjectRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};
