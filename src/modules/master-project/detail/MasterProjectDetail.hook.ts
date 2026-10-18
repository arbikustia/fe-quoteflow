/* eslint-disable jsdoc/require-jsdoc */
import { useNavigate, useParams } from "react-router-dom";

import type { ProjectData } from "../MasterProject.type";

import type { MasterProjectDetailState } from "./MasterProjectDetail.type";

import { mapProject, useGetProjectByIdQuery } from "@/services/master-project.service";

/**
 * Manage project detail state.
 * @returns {MasterProjectDetailState} Detail state
 */
export const useMasterProjectDetail = (): MasterProjectDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const { data, error, isLoading } = useGetProjectByIdQuery(id ?? "", { skip: !id });
  const project: ProjectData | null = data?.status && data.data ? mapProject(data.data) : null;
  const errorMessage = error ? "Unable to load project detail." : data && !data.status ? "Project detail is unavailable." : null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => {
    if (project) {
      navigate(`/master-project/edit/${project.id}`);
    }
  };

  return { project, isLoading, errorMessage, goBack, goEdit };
};
