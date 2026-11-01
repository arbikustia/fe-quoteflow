import type { ApiChecklist } from "../ItemChecklist.type";

export type ItemChecklistDetailState = {
  checklist: ApiChecklist | null;
  isLoading: boolean;
  errorMessage: string | null;
  goBack: () => void;
  goEdit: () => void;
  onDownload: () => void;
};
