import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { SelectOption } from "@/components/Select";

import type {
  ReturnCreateFormState,
  ReturnFieldsState,
  ReturnHandlersState,
  ReturnItemOverrides,
  ReturnItemsState,
  ReturnOrderItemRow,
  ReturnPhotoOverrides,
  ReturnPhotosState,
  ReturnSaveError,
  ReturnSaveInput,
  ReturnSourceState,
  ReturnSubmitState,
} from "./ItemReturnCreate.type";
import {
  applyItemOverrides,
  buildItemCategoryMap,
  buildSubmitPayload,
  filterReturnItems,
  getActivityName,
  getOrderItems,
  getOrderOptions,
  getReturnItems,
  getReturnSaveError,
  getSaveErrorMessage,
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

  const orderOptions = useMemo<SelectOption[]>(() => (ordersQuery.data?.status ? getOrderOptions(ordersQuery.data.data as ApiRentalOrder[]) : []), [ordersQuery.data]);

  const selectedOrder = useMemo(
    () => (ordersQuery.data?.status ? (ordersQuery.data.data as ApiRentalOrder[]).find((order) => order.id === selectedOrderId) : undefined),
    [ordersQuery.data, selectedOrderId],
  );

  const returnData = detailQuery.data?.status ? detailQuery.data.data : null;

  const rawOrderItems = useMemo(
    () => (isEditMode && returnData ? getReturnItems(returnData, categoryMap) : getOrderItems(selectedOrder, categoryMap)),
    [isEditMode, returnData, selectedOrder, categoryMap],
  );

  const returnItemIds = useMemo(
    () => (isEditMode && returnData ? returnData.items.map((item) => item.id) : rawOrderItems.map((item) => item.id)),
    [isEditMode, returnData, rawOrderItems],
  );

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
 * @returns {ReturnItemsState} Items state
 */
export const useReturnItems = (fields: ReturnFieldsState, rawOrderItems: ReturnOrderItemRow[]): ReturnItemsState => {
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
    const { id, source, orderItems, photos } = input;
    const currentOrderId = photos.guards.orderId.current;
    const activeRows = orderItems.filter((row) => source.returnItemIds.includes(row.id));
    const uploadedRows = await photos.uploadStaged(activeRows);

    if (currentOrderId !== photos.guards.orderId.current) {
      return null;
    }

    const payload = buildSubmitPayload(input, uploadedRows);

    const result = source.isEditMode && id ? await updateReturn({ id, body: payload }) : await createReturn(payload);

    if (result.error) {
      return getSaveErrorMessage(result.error);
    }

    if (!result.data?.status) {
      return result.data?.messages.join(" ") || "Unable to save item return.";
    }

    return null;
  };

  /**
   * Record activity log after successful save.
   * @param {ReturnSaveInput} input - Submission input
   * @returns {Promise<void>} Log completion
   */
  const recordActivity = async (input: ReturnSaveInput): Promise<void> => {
    const name = getActivityName(input);

    if (input.source.isEditMode) {
      await logEdit(name);
    }
    else {
      await logCreate(name);
    }
  };

  return { isSubmitting: isCreating || isUpdating, submit, recordActivity };
};

/**
 * Build save handler for the return form.
 * @param {ReturnSaveInput} input - Save dependencies
 * @returns {() => Promise<void>} Save handler
 */
export const useReturnSave = (input: ReturnSaveInput): (() => Promise<void>) => {
  const { fields, photos, submitState, navigate } = input;

  return async (): Promise<void> => {
    if (photos.guards.saving.current) {
      return;
    }

    const validationError = getReturnSaveError(input);

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
      navigate("/item-return");
    } catch (error) {
      fields.setErrorMessage(getSaveErrorMessage(error as ReturnSaveError));
    } finally {
      photos.guards.saving.current = false;
      fields.setUploadingItemId(null);
    }
  };
};

/**
 * Initialise the form fields from the loaded return in edit mode.
 * @param {string | undefined} id - Return id
 * @param {ReturnSourceState} source - Source state
 * @param {ReturnFieldsState} fields - Form fields
 * @returns {void} Nothing
 */
export const useReturnInit = (id: string | undefined, source: ReturnSourceState, fields: ReturnFieldsState): void => {
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || !source.returnData || initializedRef.current === id) {
      return;
    }

    initializedRef.current = id;
    fields.setSelectedOrderId(source.returnData.order_id);
    fields.setReturnDate(source.returnData.return_date);
    fields.setReturnNotes(source.returnData.notes);
  }, [id, source.returnData, fields]);
};

/**
 * Build the form change and navigation handlers.
 * @param {ReturnFieldsState} fields - Form fields
 * @param {ReturnPhotosState} photos - Photo state
 * @param {(path: string) => void} navigate - Router navigate
 * @returns {ReturnHandlersState} Form handlers
 */
export const useReturnHandlers = (fields: ReturnFieldsState, photos: ReturnPhotosState, navigate: (path: string) => void): ReturnHandlersState => {
  /**
   * Handle order change and reset photo/item overrides.
   * @param {string} value - Selected order id
   * @returns {void} Nothing
   */
  const handleOrderChange = (value: string): void => {
    if (photos.guards.upload.current || photos.guards.saving.current) {
      return;
    }

    photos.resetPhotos();
    photos.setOrderGuard(value);
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
  const goBack = (): void => navigate("/item-return");

  return { handleOrderChange, handleSearchChange: fields.setSearchTerm, handleDateChange: fields.setReturnDate, handleNotesChange: fields.setReturnNotes, goBack };
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
  const handlers = useReturnHandlers(fields, photos, navigate);
  const handleSave = useReturnSave({ id, source, fields, orderItems: items.orderItems, photos, submitState, navigate });

  useReturnInit(id, source, fields);

  return {
    ...photos.view,
    ...items,
    ...handlers,
    orderOptions: source.orderOptions,
    isOrdersLoading: source.isOrdersLoading,
    isLoadingInitialData: source.isLoadingInitialData,
    isEditMode,
    selectedOrderId: fields.selectedOrderId,
    returnItemIds: source.returnItemIds,
    uploadingItemId: fields.uploadingItemId,
    returnDate: fields.returnDate,
    returnNotes: fields.returnNotes,
    searchTerm: fields.searchTerm,
    isSubmitting: submitState.isSubmitting || Boolean(fields.uploadingItemId),
    errorMessage: fields.errorMessage,
    handleSave,
  };
};
