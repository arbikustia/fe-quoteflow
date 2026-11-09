import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { ChecklistCreateFormState, ChecklistLogicState } from "./ItemChecklistCreate.type";
import { useChecklistHandlers, useFilteredOrderItems, useItemChecklistFormState } from "./ItemChecklistForm.hook";
import { useItemChecklistData } from "./ItemChecklistHelpers";
import { useItemChecklistSaveHandler } from "./ItemChecklistSave.hook";
import { useItemChecklistScan } from "./ItemChecklistScan.hook";

import { useGetAllItemsQuery } from "@/services/master-item.service";
import {
  useCreateRentalChecklistMutation,
  useGetRentalChecklistByIdQuery,
  useUpdateRentalChecklistMutation,
} from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

/**
 * Custom hook logic for ItemChecklist.
 * @returns {ChecklistLogicState} - Logic state
 */
const useItemChecklistLogic = (): ChecklistLogicState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [createChecklist, { isLoading: isCreating }] = useCreateRentalChecklistMutation();
  const [updateChecklist, { isLoading: isUpdating }] = useUpdateRentalChecklistMutation();
  const { logCreate, logEdit } = useMasterActivityLog("Item Checklist");
  const detailQuery = useGetRentalChecklistByIdQuery(id ?? "", { skip: !id });

  const ordersQuery = useGetRentalOrderOptionsQuery();
  const itemsQuery = useGetAllItemsQuery();
  const initializedChecklistId = useRef<string | null>(null);
  const form = useItemChecklistFormState();
  const data = useItemChecklistData({
    isEditMode,
    selectedOrderId: form.selectedOrderId,
    detailData: detailQuery.data?.status ? detailQuery.data.data : null,
    ordersData: ordersQuery.data?.status ? ordersQuery.data.data : [],
    ordersStatus: ordersQuery.data?.status,
    itemsData: itemsQuery.data?.status ? itemsQuery.data.data.map(i => ({ id: i.id, category_name: i.category_name ?? undefined })) : [],
    itemsStatus: itemsQuery.data?.status,
  });

  useItemChecklistScan({ orderItems: data.orderItems, focusAt: form.focusAt, setMoveInItemIds: form.setMoveInItemIds, setMoveOutItemIds: form.setMoveOutItemIds, setSearchTerm: form.setSearchTerm });

  /**
   * Initializes checklist.
   */
  const initializeEffect = (): void => {
    if (!id || !data.checklist || initializedChecklistId.current === id) return;

    initializedChecklistId.current = id;
    form.setSelectedOrderId(data.checklist.order_id);
    form.setMoveOutItemIds(data.checklist.items.filter(i => i.move_out).map(i => i.id));
    form.setMoveInItemIds(data.checklist.items.filter(i => i.move_in).map(i => i.id));
  };

  useEffect(initializeEffect, [id, data.checklist, form]);

  const filteredOrderItems = useFilteredOrderItems(data.orderItems, form.searchTerm);

  const handleSave = useItemChecklistSaveHandler({ id, isEditMode, checklist: data.checklist, selectedOrder: data.selectedOrder, selectedOrderId: form.selectedOrderId, orderItems: data.orderItems, moveOutItemIds: form.moveOutItemIds, moveInItemIds: form.moveInItemIds, createChecklist, updateChecklist, logCreate, logEdit, navigate, setSaveErrorMessage: form.setSaveErrorMessage });

  return { navigate, id, isEditMode, detailQuery, ordersQuery, form, data, isCreating, isUpdating, filteredOrderItems, handleSave };
};

/**
 * Manage checklist form state.
 * @returns {ChecklistCreateFormState} - Checklist form state
 */
export const useItemChecklistCreate = (): ChecklistCreateFormState => {
  const logic = useItemChecklistLogic();
  const { navigate, id, isEditMode, detailQuery, ordersQuery, form, data } = logic;
  const loadError = useMemo(() => {
    if (isEditMode && (!id || detailQuery.error || (detailQuery.data && !detailQuery.data.status))) return "Unable to load item checklist.";

    if (!isEditMode && ordersQuery.error) return "Unable to load rental orders.";

    return null;
  }, [isEditMode, id, detailQuery.error, detailQuery.data, ordersQuery.error]);

  const handlers = useChecklistHandlers(form);

  /**
   *
   */
  const goBack = (): void => { navigate("/item-checklist"); };

  return {
    orderOptions: data.orderOptions,
    isOrdersLoading: !isEditMode && ordersQuery.isLoading,
    isLoadingInitialData: isEditMode && detailQuery.isLoading,
    isEditMode,
    selectedOrderId: form.selectedOrderId,
    focusAt: form.focusAt,
    orderItems: data.orderItems,
    filteredOrderItems: logic.filteredOrderItems,
    moveOutItemIds: form.moveOutItemIds,
    moveInItemIds: form.moveInItemIds,
    searchTerm: form.searchTerm,
    isSubmitting: logic.isCreating || logic.isUpdating,
    errorMessage: form.saveErrorMessage ?? loadError,
    ...handlers,
    handleSave: logic.handleSave,
    goBack,
  };
};
