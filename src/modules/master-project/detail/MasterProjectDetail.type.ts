import type { ProjectData } from "../MasterProject.type";

export type MasterProjectDetailState = {
  readonly project: ProjectData | null;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
};
