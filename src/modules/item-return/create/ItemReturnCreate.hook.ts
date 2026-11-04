import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { SelectOption } from "@/components/Select";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import { useGetAllItemsQuery, useUploadImageMutation } from "@/services/master-item.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";
import {
  useCreateRentalReturnMutation,
  useGetRentalReturnByIdQuery,
  useUpdateRentalReturnMutation,
} from "@/services/rental-return.service";

import { stampReturnPhoto } from "./ItemReturnCreate.helpers";
import type { ReturnCreateFormState, ReturnOrderItemRow } from "./ItemReturnCreate.type";
import type { ReturnCreatePayload } from "../ItemReturn.type";
import type { ApiReturn } from "../ItemReturn.type";

const _getCustomerName = (order: ApiRentalOrder): string =>
  order.invoice?.quotation?.transaction?.customer_name ??
  order.invoice?.quotation?.transaction?.customer?.name ??
  "";

const _getOrderOptions = (orders: ApiRentalOrder[]): SelectOption[] =>
  orders.map((order) => ({
    value: order.id,
    label: `${_getCustomerName(order)} — ${order.order_no}`,
  }));

const _getReturnItems = (returnData: ApiReturn, categories: Map<string, string>): ReturnOrderItemRow[] =>
  returnData.items.map((item): ReturnOrderItemRow => ({
    id: item.id,
    itemId: item.item_id,
    itemName: item.notes || `Item ${item.item_id.slice(0, 8)}`,
    category: categories.get(item.item_id) ?? "-",
    qty: item.qty,
    unit: item.qty === 1 ? "unit" : "units",
    condition: item.condition || "Good",
    notes: item.notes || "",
    fileUrl: item.file_url,
    fileName: item.file_name,
  }));

const _getOrderItems = (
  order: ApiRentalOrder | undefined,
  itemCategoryMap: Map<string, string>,
): ReturnOrderItemRow[] => {
  if (!order) return [];

  const transaction = order.invoice?.quotation?.transaction;
  const rows: ReturnOrderItemRow[] = [];

  const standardItems = transaction?.rental_transaction_items ?? [];
  standardItems.forEach((item, index) => {
    rows.push({
      id: `${item.item_id}-${index}`,
      itemId: item.item_id,
      itemName: item.item_name,
      category: itemCategoryMap.get(item.item_id) ?? "-",
      qty: item.qty,
      unit: item.qty === 1 ? "unit" : "units",
      condition: "Good",
      notes: "",
      fileUrl: "",
      fileName: "",
    });
  });

  const projectItems = transaction?.rental_transaction_project ?? [];
  projectItems.forEach((project, projectIndex) => {
    project.items?.forEach((item, itemIndex) => {
      rows.push({
        id: `${item.item_id}-proj-${projectIndex}-${itemIndex}`,
        itemId: item.item_id,
        itemName: item.item_name,
        category: itemCategoryMap.get(item.item_id) ?? "-",
        qty: item.qty,
        unit: item.qty === 1 ? "unit" : "units",
        condition: "Good",
        notes: "",
        fileUrl: "",
        fileName: "",
      });
    });
  });

  return rows;
};

/**
 * Format date to MM-DD-YYYY 12:00:00.
 */
export const formatReturnDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year} 12:00:00`;
};

const _buildPayload = (
  orderId: string,
  returnDate: string,
  returnNotes: string,
  status: number,
  rows: ReturnOrderItemRow[],
  returnItemIds: string[],
): ReturnCreatePayload => ({
  order_id: orderId,
  return_date: returnDate ? formatReturnDate(new Date(returnDate)) : formatReturnDate(new Date()),
  notes: returnNotes,
  status,
  items: rows
    .filter((row) => returnItemIds.includes(row.id))
    .map((row) => ({
      item_id: row.itemId,
      qty: row.qty,
      condition: "",
      notes: row.notes,
      file_url: row.fileUrl || "",
      file_name: row.fileName || "",
    })),
});

const _getPhotoValidationError = (isUploading: boolean, hasPreview: boolean, itemCount: number): string | null => {
  if (isUploading) return "Wait for photo upload to finish.";
  if (hasPreview) return "Confirm or discard photo before saving.";
  if (itemCount === 0) return "No items available to return for this order.";

  return null;
};

/** Manage create and edit item return state. @returns {ReturnCreateFormState} Return form state. */
export const useItemReturnCreate = (): ReturnCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [createReturn, { isLoading: isCreating }] = useCreateRentalReturnMutation();
  const [updateReturn, { isLoading: isUpdating }] = useUpdateRentalReturnMutation();
  const { logCreate, logEdit } = useMasterActivityLog("Item Return");
  const [uploadImage] = useUploadImageMutation();
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [stagedPhotos, setStagedPhotos] = useState<Map<string, { file: File; url: string }>>(new Map());
  const stagedPhotosRef = useRef<Map<string, { file: File; url: string }>>(new Map());
  const uploadedPhotosRef = useRef<Map<string, { fileUrl: string; fileName: string }>>(new Map());
  const orderIdRef = useRef("");
  const uploadRef = useRef(false);
  const isSavingRef = useRef(false);
  const pendingPhoto = useRef<File | null>(null);
  const previewUrl = useRef<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<{ itemId: string; itemName: string; url: string } | null>(null);
  const [viewedPhoto, setViewedPhoto] = useState<{ itemName: string; url: string } | null>(null);
  const viewedPhotoRef = useRef<{ itemName: string; url: string } | null>(null);

  const closeViewedPhoto = (): void => {
    viewedPhotoRef.current = null;
    setViewedPhoto(null);
  };

  const detailQuery = useGetRentalReturnByIdQuery(id ?? "", { skip: !id });
  const ordersQuery = useGetRentalOrderOptionsQuery();
  const itemsQuery = useGetAllItemsQuery();
  const initializedReturnId = useRef<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [itemOverrides, setItemOverrides] = useState<Record<string, { condition?: string; notes?: string }>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const itemCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    if (itemsQuery.data?.status && itemsQuery.data.data) {
      itemsQuery.data.data.forEach((item) => {
        if (item.category_name) {
          map.set(item.id, item.category_name);
        }
      });
    }

    return map;
  }, [itemsQuery.data]);

  const orderOptions = ordersQuery.data?.status ? _getOrderOptions(ordersQuery.data.data) : [];

  const selectedOrder = ordersQuery.data?.status
    ? ordersQuery.data.data.find((order) => order.id === selectedOrderId)
    : undefined;
  const returnData = detailQuery.data?.status ? detailQuery.data.data : null;

  const rawOrderItems = useMemo(() => {
    if (isEditMode && returnData) {
      return _getReturnItems(returnData, itemCategoryMap);
    }

    return _getOrderItems(selectedOrder, itemCategoryMap);
  }, [isEditMode, returnData, selectedOrder, itemCategoryMap]);

  const orderItems = useMemo(
    () =>
      rawOrderItems.map((item) => ({
        ...item,
        condition: itemOverrides[item.id]?.condition ?? item.condition,
        notes: itemOverrides[item.id]?.notes ?? item.notes,
      })),
    [rawOrderItems, itemOverrides],
  );

  const returnItemIds = useMemo(() => {
    if (isEditMode && returnData) {
      return returnData.items.map((item) => item.id);
    }

    return rawOrderItems.map((item) => item.id);
  }, [isEditMode, returnData, rawOrderItems]);

  useEffect((): void => {
    if (!id || !returnData || initializedReturnId.current === id) return;

    initializedReturnId.current = id;
    setSelectedOrderId(returnData.order_id);
    setReturnDate(returnData.return_date);
    setReturnNotes(returnData.notes);
  }, [id, returnData]);

  const openPhoto = (itemId: string): void => {
    const row = orderItems.find((item) => item.id === itemId);
    if (!row) return;
    const url = stagedPhotosRef.current.get(itemId)?.url ?? row.fileUrl;
    if (!url) return;

    viewedPhotoRef.current = { itemName: row.itemName, url };
    setViewedPhoto(viewedPhotoRef.current);
  };

  const filteredOrderItems = useMemo(() => {
    if (!searchTerm.trim()) return orderItems;
    const lower = searchTerm.toLowerCase();

    return orderItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.condition.toLowerCase().includes(lower),
    );
  }, [orderItems, searchTerm]);

  const clearStagedPhotos = (): void => {
    stagedPhotosRef.current.forEach((staged): void => URL.revokeObjectURL(staged.url));
    stagedPhotosRef.current.clear();
    setStagedPhotos(new Map());
    closeViewedPhoto();
  };

  const closePhotoPreview = (): void => {
    if (uploadRef.current || isSavingRef.current) return;
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
    pendingPhoto.current = null;
    setPhotoPreview(null);
  };

  useEffect(() => (): void => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    stagedPhotosRef.current.forEach((staged): void => URL.revokeObjectURL(staged.url));
  }, []);

  const handleOrderChange = (value: string): void => {
    if (uploadRef.current || isSavingRef.current) return;
    closePhotoPreview();
    clearStagedPhotos();
    uploadedPhotosRef.current.clear();
    orderIdRef.current = value;
    setSelectedOrderId(value);
    setItemOverrides({});
    setSearchTerm("");
    setSaveErrorMessage(null);
  };

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };

  const handleDateChange = (date: string): void => {
    setReturnDate(date);
  };

  const handleNotesChange = (notes: string): void => {
    setReturnNotes(notes);
  };

  const onCaptureItem = async (itemId: string, file: File): Promise<void> => {
    const selectedItem = orderItems.find((item) => item.id === itemId);
    if (uploadRef.current || isSavingRef.current || !selectedItem) return;

    uploadRef.current = true;
    setUploadingItemId(itemId);
    setSaveErrorMessage(null);
    const currentOrderId = orderIdRef.current;

    try {
      const stampedFile = await stampReturnPhoto(file);
      if (currentOrderId !== orderIdRef.current) return;

      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      const url = URL.createObjectURL(stampedFile);
      previewUrl.current = url;
      pendingPhoto.current = stampedFile;
      setPhotoPreview({ itemId, itemName: selectedItem.itemName, url });
    } catch (error) {
      setSaveErrorMessage(error instanceof Error ? error.message : "Photo processing failed. Retry capture.");
    } finally {
      uploadRef.current = false;
      setUploadingItemId(null);
    }
  };

  const confirmPhoto = (): void => {
    const file = pendingPhoto.current;
    const preview = photoPreview;
    if (!file || !preview || uploadRef.current || isSavingRef.current) return;

    const previous = stagedPhotosRef.current.get(preview.itemId);
    if (previous) {
      if (viewedPhotoRef.current?.url === previous.url) closeViewedPhoto();
      URL.revokeObjectURL(previous.url);
    }
    const staged = { file, url: preview.url };
    stagedPhotosRef.current.set(preview.itemId, staged);
    setStagedPhotos(new Map(stagedPhotosRef.current));
    uploadedPhotosRef.current.delete(preview.itemId);
    previewUrl.current = null;
    pendingPhoto.current = null;
    setPhotoPreview(null);
    setSaveErrorMessage(null);
  };

  const onItemConditionChange = (itemId: string, condition: string): void => {
    setItemOverrides((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], condition },
    }));
  };

  const onItemNotesChange = (itemId: string, notes: string): void => {
    setItemOverrides((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes },
    }));
  };

  const uploadStagedPhotos = async (rows: ReturnOrderItemRow[]): Promise<ReturnOrderItemRow[]> => {
    for (const row of rows) {
      const staged = stagedPhotosRef.current.get(row.id);
      if (!staged || uploadedPhotosRef.current.has(row.id)) continue;

      setUploadingItemId(row.id);
      const formData = new FormData();
      formData.append("file", staged.file);
      const uploadResult = await uploadImage(formData).unwrap();
      if (!uploadResult.url || !uploadResult.file_name) {
        throw new Error(`Upload returned incomplete photo data for ${row.itemName}.`);
      }

      uploadedPhotosRef.current.set(row.id, { fileUrl: uploadResult.url, fileName: uploadResult.file_name });
      if (viewedPhotoRef.current?.url === staged.url) closeViewedPhoto();
      URL.revokeObjectURL(staged.url);
      stagedPhotosRef.current.delete(row.id);
      setStagedPhotos(new Map(stagedPhotosRef.current));
    }

    setUploadingItemId(null);

    return rows.map((row): ReturnOrderItemRow => {
      const uploaded = uploadedPhotosRef.current.get(row.id);

      return { ...row, fileUrl: uploaded?.fileUrl ?? row.fileUrl, fileName: uploaded?.fileName ?? row.fileName };
    });
  };

  const getSaveValidationError = (): string | null => {
    if (isEditMode && (!returnData || !id)) return "Unable to load item return.";
    if (!isEditMode && !selectedOrder) return "Please select a rental order first.";

    return _getPhotoValidationError(uploadRef.current, Boolean(photoPreview), returnItemIds.length);
  };

  const _recordSaveActivity = async (): Promise<void> => {
    const returnName = returnData?.id ?? selectedOrderId ?? id ?? "Item Return";
    if (isEditMode) {
      await logEdit(returnName);
    } else {
      await logCreate(returnName);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (isSavingRef.current) return;
    const validationError = getSaveValidationError();
    if (validationError) {
      setSaveErrorMessage(validationError);
      return;
    }

    setSaveErrorMessage(null);
    isSavingRef.current = true;
    const currentOrderId = orderIdRef.current;

    try {
      const activeRows = orderItems.filter((row) => returnItemIds.includes(row.id));
      const rowsWithPhotos = await uploadStagedPhotos(activeRows);
      if (currentOrderId !== orderIdRef.current) return;

      const payload = _buildPayload(
        returnData?.order_id ?? selectedOrderId,
        returnDate,
        returnNotes,
        isEditMode ? returnData?.status ?? 1 : 1,
        rowsWithPhotos,
        returnItemIds,
      );

      const result = isEditMode && id
        ? await updateReturn({ id, body: payload })
        : await createReturn(payload);

      if (result.error) {
        const apiMessage = "data" in result.error ? result.error.data : result.error.message;
        setSaveErrorMessage(
          Array.isArray(apiMessage) ? apiMessage.join(" ") : apiMessage ?? "Unable to save item return.",
        );
        return;
      }

      if (!result.data?.status) {
        setSaveErrorMessage(result.data?.messages.join(" ") || "Unable to save item return.");
        return;
      }

      await _recordSaveActivity();

      void navigate("/item-return");
    } catch (error) {
      setSaveErrorMessage(error instanceof Error ? error.message : "Unable to save item return.");
    } finally {
      isSavingRef.current = false;
      setUploadingItemId(null);
    }
  };

  const goBack = (): void => {
    void navigate("/item-return");
  };

  return {
    orderOptions,
    isOrdersLoading: ordersQuery.isLoading,
    isLoadingInitialData: isEditMode && detailQuery.isLoading,
    isEditMode,
    selectedOrderId,
    orderItems,
    filteredOrderItems,
    returnItemIds,
    uploadingItemId,
    photoPreview,
    stagedPhotoUrls: new Map([...stagedPhotos].map(([itemId, staged]) => [itemId, staged.url])),
    viewedPhoto,
    openPhoto,
    closeViewedPhoto,
    confirmPhoto,
    closePhotoPreview,
    returnDate,
    returnNotes,
    searchTerm,
    isSubmitting: isCreating || isUpdating || Boolean(uploadingItemId),
    errorMessage: saveErrorMessage,
    handleOrderChange,
    handleSearchChange,
    handleDateChange,
    handleNotesChange,
    onCaptureItem,
    onItemConditionChange,
    onItemNotesChange,
    handleSave,
    goBack,
  };
};
