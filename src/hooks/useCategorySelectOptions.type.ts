import type { CategoryAllItem } from "@/modules/master-data/master-category/MasterCategory.type";

/** Category options for select inputs, with loading and error state. */
export type CategorySelectState = {
  categories: CategoryAllItem[];
  isLoading: boolean;
  errorMessage: string | null;
};
