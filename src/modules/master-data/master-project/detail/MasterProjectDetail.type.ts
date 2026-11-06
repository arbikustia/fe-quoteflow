import type { ProjectData } from "../MasterProject.type";

export type MasterProjectDetailState = {
  project: ProjectData | null;
  isLoading: boolean;
  errorMessage: string | null;
  goBack: () => void;
  goEdit: () => void;
};
