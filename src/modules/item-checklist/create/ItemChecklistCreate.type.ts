import type { Dispatch, SetStateAction } from "react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import type { SelectOption } from "@/components/Select";

import type { ApiChecklist } from "../ItemChecklist.type";
export type { ApiChecklist } from "../ItemChecklist.type";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import type { useCreateRentalChecklistMutation, useGetRentalChecklistByIdQuery, useUpdateRentalChecklistMutation } from "@/services/rental-checklist.service";
import type { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

export type UseItemChecklistDataInput = { isEditMode: boolean; selectedOrderId: string; detailData?: ApiChecklist | null; ordersData?: ApiRentalOrder[]; ordersStatus?: boolean; itemsData?: { id: string; category_name?: string }[]; itemsStatus?: boolean };
export type ChecklistDataState = { orderOptions: SelectOption[]; selectedOrder?: ApiRentalOrder; checklist: ApiChecklist | null; orderItems: ChecklistOrderItemRow[] };
export type UseItemChecklistScanInput = { orderItems: ChecklistOrderItemRow[]; focusAt: string; setMoveInItemIds: Dispatch<SetStateAction<string[]>>; setMoveOutItemIds: Dispatch<SetStateAction<string[]>>; setSearchTerm: Dispatch<SetStateAction<string>>; setHighlightedRowId: Dispatch<SetStateAction<string>>; setNotFoundItemCode: Dispatch<SetStateAction<string>> };
export type UseItemChecklistSaveInput = { id?: string; isEditMode: boolean; checklist: ApiChecklist | null; selectedOrder?: ApiRentalOrder; selectedOrderId: string; orderItems: ChecklistOrderItemRow[]; moveOutItemIds: string[]; moveInItemIds: string[]; createChecklist: ReturnType<typeof useCreateRentalChecklistMutation>[0]; updateChecklist: ReturnType<typeof useUpdateRentalChecklistMutation>[0]; logCreate: (name: string) => Promise<void>; logEdit: (name: string) => Promise<void>; navigate: (path: string) => void; setSaveErrorMessage: Dispatch<SetStateAction<string | null>> };
export type ChecklistSaveError = FetchBaseQueryError | SerializedError;

export type OrderItemSource = { item_id: string; item_name?: string; category_name?: string; qty: number };
export type ChecklistPayloadParams = { orderId: string; status: number; rows: ChecklistOrderItemRow[]; moveOutIds: string[]; moveInIds: string[]; checklist?: ApiChecklist };
export type ChecklistLoadErrorInput = { isEditMode: boolean; id?: string; hasDetailError: boolean; detailStatus?: boolean; hasOrdersError: boolean };
export type ChecklistInitializationInput = { id?: string; checklist: ApiChecklist | null; setSelectedOrderId: Dispatch<SetStateAction<string>>; setMoveOutItemIds: Dispatch<SetStateAction<string[]>>; setMoveInItemIds: Dispatch<SetStateAction<string[]>> };
export type ChecklistControls = { selectedOrderId: string; setSelectedOrderId: Dispatch<SetStateAction<string>>; focusAt: ChecklistFocusAt; setFocusAt: Dispatch<SetStateAction<ChecklistFocusAt>>; moveOutItemIds: string[]; setMoveOutItemIds: Dispatch<SetStateAction<string[]>>; moveInItemIds: string[]; setMoveInItemIds: Dispatch<SetStateAction<string[]>>; searchTerm: string; setSearchTerm: Dispatch<SetStateAction<string>>; saveErrorMessage: string | null; setSaveErrorMessage: Dispatch<SetStateAction<string | null>>; highlightedRowId: string; setHighlightedRowId: Dispatch<SetStateAction<string>>; notFoundItemCode: string; setNotFoundItemCode: Dispatch<SetStateAction<string>> };
export type ChecklistHandlers = Pick<ChecklistCreateFormState, "handleOrderChange" | "handleFocusAtChange" | "handleSearchChange">;
export type ChecklistLogicState = { navigate: (path: string) => void; id?: string; isEditMode: boolean; detailQuery: ReturnType<typeof useGetRentalChecklistByIdQuery>; ordersQuery: ReturnType<typeof useGetRentalOrderOptionsQuery>; form: ChecklistControls; data: ChecklistDataState; isCreating: boolean; isUpdating: boolean; filteredOrderItems: ChecklistOrderItemRow[]; handleSave: () => Promise<void> };
export type ApiQueryError = { status?: number; message?: string };
export type ChecklistSaveResult = { data?: { status: boolean; messages: string[] }; error?: ChecklistSaveError };

export type ChecklistFocusAt = "moveIn" | "moveOut";

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

export type ChecklistPayloadInput = {
  orderId: string;
  status: number;
  rows: ChecklistOrderItemRow[];
  moveOutIds: string[];
  moveInIds: string[];
  checklist?: ApiChecklist;
};

export type ChecklistCreateFormState = {
  orderOptions: SelectOption[];
  isOrdersLoading: boolean;
  isLoadingInitialData: boolean;
  isEditMode: boolean;
  selectedOrderId: string;
  focusAt: ChecklistFocusAt;
  orderItems: ChecklistOrderItemRow[];
  filteredOrderItems: ChecklistOrderItemRow[];
  moveOutItemIds: string[];
  moveInItemIds: string[];
  searchTerm: string;
  highlightedRowId: string;
  notFoundItemCode: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleOrderChange: (value: string) => void;
  handleFocusAtChange: (value: string) => void;
  handleSearchChange: (term: string) => void;
  handleSave: () => Promise<void>;
  goBack: () => void;
};
