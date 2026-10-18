import { useNavigate, useParams } from "react-router-dom";

import type { ProjectData } from "../MasterProject.type";

import type { MasterProjectDetailState } from "./MasterProjectDetail.type";

import {
  mapProject,
  useGetProjectByIdQuery,
} from "@/services/master-project.service";

/**
 * Resolve error message for project detail query.
 * @param {boolean} hasError - Query error flag
 * @param {boolean} isMissingData - Missing status flag
 * @returns {string | null} Error message or null
 */
const _resolveErrorMessage = (
  hasError: boolean,
  isMissingData: boolean,
): string | null => {
  if (hasError) {
    return "Unable to load project detail.";
  }

  if (isMissingData) {
    return "Project detail is unavailable.";
  }

  return null;
};

/**
 * Manage project detail state.
 * @returns {MasterProjectDetailState} Detail state
 */
export const useMasterProjectDetail = (): MasterProjectDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const { data, error, isLoading } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });
  const project: ProjectData | null =
    data?.status && data.data ? mapProject(data.data) : null;
  const errorMessage = _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to project edit page.
   * @returns {void} No return value
   */
  const goEdit = (): void => {
    if (project) {
      navigate(`/master-project/edit/${project.id}`);
    }
  };

  return { project, isLoading, errorMessage, goBack, goEdit };
};
