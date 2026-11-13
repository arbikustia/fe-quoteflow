import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { SelectOption } from "@/components/Select";

import type {
  ReturnSaveError,
  ReturnCreateFormState,
  ReturnFieldsState,
  ReturnItemOverrides,
  ReturnOrderItemRow,
  ReturnPhotoOverrides,
  ReturnPhotosState,
  ReturnSaveInput,
  ReturnSourceState,
  ReturnSubmitState,
} from "./ItemReturnCreate.type";
import {
  applyItemOverrides,
  buildItemCategoryMap,
  buildReturnPayload,
  filterReturnItems,
  getOrderItems,
  getOrderOptions,
  getReturnItems,
  getSaveErrorMessage,
  getSaveValidationError,
} from "./ItemReturnCreate.util";
import { useReturnPhotos } from "./ItemReturnPhotos.hook";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";
import {
  useCreateRentalReturnMutation,
  useGetRentalReturnByIdQuery,
  useUpdateRentalReturnMutation,
} from "@/services/rental-return.service";

/**
 * Manage return form fields state.
 * @returns {ReturnFieldsState} Fields state
 */
export const useReturnFields = (): ReturnFieldsState => {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [itemOverrides, setItemOverrides] = useState<ReturnItemOverrides>({});
  const [photoOverrides, setPhotoOverrides] = useState<ReturnPhotoOverrides>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  return {
    selectedOrderId,
    setSelectedOrderId,
    returnDate,
    setReturnDate,
    returnNotes,
    setReturnNotes,
    itemOverrides,
    setItemOverrides,
    photoOverrides,
    setPhotoOverrides,
    searchTerm,
    setSearchTerm,
    errorMessage,
    setErrorMessage,
    uploadingItemId,
    setUploadingItemId,
  };
};

/**
 * Fetch and process order source data for creation and edit mode.
 * @param {string} selectedOrderId - Selected order id
 * @param {boolean} isEditMode - Edit mode flag
 * @param {string | undefined} id - Return id
 * @returns {ReturnSourceState} Source state
 */
export const useReturnSource = (selectedOrderId: string, isEditMode: boolean, id?: string): ReturnSourceState => {
  const detailQuery = useGetRentalReturnByIdQuery(id ?? "", { skip: !id });
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const itemsQuery = useGetAllItemsQuery();

  const categoryMap = useMemo(
    () => (itemsQuery.data?.status && itemsQuery.data.data ? buildItemCategoryMap(itemsQuery.data.data) : new Map()),
    [itemsQuery.data],
  );

  const orderOptions = useMemo<SelectOption[]>(
    () => (ordersQuery.data?.status ? getOrderOptions(ordersQuery.data.data as ApiRentalOrder[]) : []),
    [ordersQuery.data],
  );

  const selectedOrder = useMemo(
    () => (ordersQuery.data?.status ? (ordersQuery.data.data as ApiRentalOrder[]).find((order) => order.id === selectedOrderId) : undefined),
    [ordersQuery.data, selectedOrderId],
  );

  const returnData = detailQuery.data?.status ? detailQuery.data.data : null;

  const rawOrderItems = useMemo(() => {
    if (isEditMode && returnData) return getReturnItems(returnData, categoryMap);

    return getOrderItems(selectedOrder, categoryMap);
  }, [isEditMode, returnData, selectedOrder, categoryMap]);

  const returnItemIds = useMemo(() => {
    if (isEditMode && returnData) return returnData.items.map((item) => item.id);

    return rawOrderItems.map((item) => item.id);
  }, [isEditMode, returnData, rawOrderItems]);

  return {
    isEditMode,
    orderOptions,
    isOrdersLoading: ordersQuery.isLoading,
    isLoadingInitialData: isEditMode && detailQuery.isLoading,
    selectedOrder,
    returnData,
    rawOrderItems,
    returnItemIds,
  };
};

/**
 * Manage order items list with overrides applied and search filter.
 * @param {ReturnFieldsState} fields - Form fields
 * @param {ReturnOrderItemRow[]} rawOrderItems - Base order items
 * @returns {{ orderItems: ReturnOrderItemRow[]; filteredOrderItems: ReturnOrderItemRow[]; onItemConditionChange: (itemId: string, condition: string) => void; onItemNotesChange: (itemId: string, notes: string) => void }} Items state
 */
export const useReturnItems = (fields: ReturnFieldsState, rawOrderItems: ReturnOrderItemRow[]): { orderItems: ReturnOrderItemRow[]; filteredOrderItems: ReturnOrderItemRow[]; onItemConditionChange: (itemId: string, condition: string) => void; onItemNotesChange: (itemId: string, notes: string) => void } => {
  const orderItems = useMemo(
    () => applyItemOverrides(rawOrderItems, fields.itemOverrides, fields.photoOverrides),
    [rawOrderItems, fields.itemOverrides, fields.photoOverrides],
  );

  const filteredOrderItems = useMemo(
    () => filterReturnItems(orderItems, fields.searchTerm),
    [orderItems, fields.searchTerm],
  );

  /**
   * Update item condition override.
   * @param {string} itemId - Item row id
   * @param {string} condition - Item condition
   * @returns {void} Nothing
   */
  const onItemConditionChange = (itemId: string, condition: string): void => {
    fields.setItemOverrides((prev) => ({ ...prev, [itemId]: { ...prev[itemId], condition } }));
  };

  /**
   * Update item notes override.
   * @param {string} itemId - Item row id
   * @param {string} notes - Item notes
   * @returns {void} Nothing
   */
  const onItemNotesChange = (itemId: string, notes: string): void => {
    fields.setItemOverrides((prev) => ({ ...prev, [itemId]: { ...prev[itemId], notes } }));
  };

  return { orderItems, filteredOrderItems, onItemConditionChange, onItemNotesChange };
};

/**
 * Manage return mutations and activity logging.
 * @returns {ReturnSubmitState} Submit state
 */
export const useReturnSubmit = (): ReturnSubmitState => {
  const [createReturn, { isLoading: isCreating }] = useCreateRentalReturnMutation();
  const [updateReturn, { isLoading: isUpdating }] = useUpdateRentalReturnMutation();
  const { logCreate, logEdit } = useMasterActivityLog("Item Return");

  /**
   * Submit item return payload.
   * @param {ReturnSaveInput} input - Submission input
   * @returns {Promise<string | null>} Error message if failed
   */
  const submit = async (input: ReturnSaveInput): Promise<string | null> => {
    const { id, source, fields, orderItems, photos } = input;
    const currentOrderId = photos.guards.orderId.current;
    const activeRows = orderItems.filter((row) => source.returnItemIds.includes(row.id));
    const uploadedRows = await photos.uploadStaged(activeRows);

    if (currentOrderId !== photos.guards.orderId.current) return null;

    const payload = buildReturnPayload({
      orderId: source.returnData?.order_id ?? fields.selectedOrderId,
      returnDate: fields.returnDate,
      returnNotes: fields.returnNotes,
      status: source.isEditMode ? (source.returnData?.status ?? 1) : 1,
      rows: uploadedRows,
      returnItemIds: source.returnItemIds,
      isEditMode: source.isEditMode,
      existingItems: source.returnData?.items,
    });

    const result = source.isEditMode && id ? await updateReturn({ id, body: payload }) : await createReturn(payload);

    if (result.error) return getSaveErrorMessage(result.error);

    if (!result.data?.status) return result.data?.messages.join(" ") || "Unable to save item return.";

    return null;
  };

  /**
   * Record activity log after successful save.
   * @param {ReturnSaveInput} input - Submission input
   * @returns {Promise<void>} Log completion
   */
  const recordActivity = async (input: ReturnSaveInput): Promise<void> => {
    const { id, source } = input;
    const name = source.returnData?.id ?? source.selectedOrder?.id ?? id ?? "Item Return";

    if (source.isEditMode) await logEdit(name);
    else await logCreate(name);
  };

  return { isSubmitting: isCreating || isUpdating, submit, recordActivity };
};

/**
 * Build save handler for the return form.
 * @param {ReturnSaveInput} input - Save dependencies
 * @returns {() => Promise<void>} Save handler
 */
export const useReturnSave = (input: ReturnSaveInput): (() => Promise<void>) => {
  const { source, fields, photos, submitState, navigate } = input;

  return async (): Promise<void> => {
    if (photos.guards.saving.current) return;

    const validationError = getSaveValidationError({
      isEditMode: source.isEditMode,
      hasId: Boolean(input.id),
      hasReturnData: Boolean(source.returnData),
      hasSelectedOrder: Boolean(source.selectedOrder),
      isUploading: photos.guards.upload.current,
      hasPreview: Boolean(photos.view.photoPreview),
      itemCount: source.returnItemIds.length,
    });

    if (validationError) {
      fields.setErrorMessage(validationError);

      return;
    }

    fields.setErrorMessage(null);
    photos.guards.saving.current = true;

    try {
      const error = await submitState.submit(input);

      if (error) {
        fields.setErrorMessage(error);

        return;
      }

      await submitState.recordActivity(input);
      void navigate("/item-return");
    } catch (error) {
      fields.setErrorMessage(getSaveErrorMessage(error as ReturnSaveError));
    } finally {
      photos.guards.saving.current = false;
      fields.setUploadingItemId(null);
    }
  };
};

/**
 * Manage create and edit item return state.
 * @returns {ReturnCreateFormState} Return form state
 */
export const useItemReturnCreate = (): ReturnCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const fields = useReturnFields();
  const source = useReturnSource(fields.selectedOrderId, isEditMode, id);
  const items = useReturnItems(fields, source.rawOrderItems);
  const photos: ReturnPhotosState = useReturnPhotos(fields, items.orderItems);
  const submitState = useReturnSubmit();

  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || !source.returnData || initializedRef.current === id) return;

    initializedRef.current = id;
    fields.setSelectedOrderId(source.returnData.order_id);
    fields.setReturnDate(source.returnData.return_date);
    fields.setReturnNotes(source.returnData.notes);
  }, [id, source.returnData, fields]);

  const saveInput: ReturnSaveInput = { id, source, fields, orderItems: items.orderItems, photos, submitState, navigate };
  const handleSave = useReturnSave(saveInput);

  /**
   * Handle order change and reset photo/item overrides.
   * @param {string} value - Selected order id
   * @returns {void} Nothing
   */
  const handleOrderChange = (value: string): void => {
    if (photos.guards.upload.current || photos.guards.saving.current) return;

    photos.resetPhotos();
    photos.guards.orderId.current = value;
    fields.setSelectedOrderId(value);
    fields.setItemOverrides({});
    fields.setPhotoOverrides(new Map());
    fields.setSearchTerm("");
    fields.setErrorMessage(null);
  };

  /**
   * Navigate back to return list.
   * @returns {void} Nothing
   */
  const goBack = (): void => { void navigate("/item-return"); };

  return {
    orderOptions: source.orderOptions,
    isOrdersLoading: source.isOrdersLoading,
    isLoadingInitialData: source.isLoadingInitialData,
    isEditMode,
    selectedOrderId: fields.selectedOrderId,
    orderItems: items.orderItems,
    filteredOrderItems: items.filteredOrderItems,
    returnItemIds: source.returnItemIds,
    uploadingItemId: fields.uploadingItemId,
    photoPreview: photos.view.photoPreview,
    stagedPhotoUrls: photos.view.stagedPhotoUrls,
    viewedPhoto: photos.view.viewedPhoto,
    openPhoto: photos.view.openPhoto,
    closeViewedPhoto: photos.view.closeViewedPhoto,
    confirmPhoto: photos.view.confirmPhoto,
    closePhotoPreview: photos.view.closePhotoPreview,
    returnDate: fields.returnDate,
    returnNotes: fields.returnNotes,
    searchTerm: fields.searchTerm,
    isSubmitting: submitState.isSubmitting || Boolean(fields.uploadingItemId),
    errorMessage: fields.errorMessage,
    handleOrderChange,
    handleSearchChange: fields.setSearchTerm,
    handleDateChange: fields.setReturnDate,
    handleNotesChange: fields.setReturnNotes,
    onCaptureItem: photos.view.onCaptureItem,
    onRemovePhoto: photos.view.onRemovePhoto,
    onItemConditionChange: items.onItemConditionChange,
    onItemNotesChange: items.onItemNotesChange,
    handleSave,
    goBack,
  };
};
