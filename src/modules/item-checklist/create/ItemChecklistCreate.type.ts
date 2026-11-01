import type { SelectOption } from "@/components/Select";

export type ChecklistOrderItemRow = {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  qty: number;
  unit: string;
  moveOut: string;
  moveIn: string;
  sign: string;
};

export type ChecklistCreateFormState = {
  orderOptions: SelectOption[];
  isOrdersLoading: boolean;
  isLoadingInitialData: boolean;
  isEditMode: boolean;
  selectedOrderId: string;
  orderItems: ChecklistOrderItemRow[];
  filteredOrderItems: ChecklistOrderItemRow[];
  moveOutItemIds: string[];
  moveInItemIds: string[];
  searchTerm: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleOrderChange: (value: string) => void;
  handleSearchChange: (term: string) => void;
  onToggleMoveOut: (id: string) => void;
  onToggleMoveIn: (id: string) => void;
  handleSave: () => Promise<void>;
  goBack: () => void;
};
