import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { SelectOption } from "@/components/Select";

import type { ApiRentalOrder } from "@/modules/report/Report.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateRentalChecklistMutation, useGetRentalChecklistByIdQuery, useUpdateRentalChecklistMutation } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

import type { ChecklistCreateFormState, ChecklistOrderItemRow } from "./ItemChecklistCreate.type";
import { getOrderCustomerName } from "../ItemChecklist.helpers";
import type { ApiChecklist, ChecklistCreatePayload } from "../ItemChecklist.type";

const _getCustomerName = (order: ApiRentalOrder): string => getOrderCustomerName(order);

const _getOrderOptions = (orders: ApiRentalOrder[]): SelectOption[] =>
  orders.map((order) => ({
    value: order.id,
    label: `${_getCustomerName(order)} — ${order.order_no}`,
  }));

const _getChecklistItems = (checklist: ApiChecklist, categories: Map<string, string>): ChecklistOrderItemRow[] =>
  checklist.items.map((item): ChecklistOrderItemRow => ({
    id: item.id,
    itemId: item.item_id,
    itemName: item.item_name || item.description,
    category: categories.get(item.item_id) ?? "-",
    qty: item.qty,
    unit: item.qty === 1 ? "unit" : "units",
    moveOut: "",
    moveIn: "",
    sign: item.sign,
  }));

const _getOrderItems = (
  order: ApiRentalOrder | undefined,
  itemCategoryMap: Map<string, string>,
): ChecklistOrderItemRow[] => {
  if (!order) return [];

  const transaction = order.invoice?.quotation?.transaction;
  const picName = transaction?.pic?.name ?? "-";
  const rows: ChecklistOrderItemRow[] = [];

  const standardItems = transaction?.rental_transaction_items ?? [];
  standardItems.forEach((item, index) => {
    rows.push({
      id: `${item.item_id}-${index}`,
      itemId: item.item_id,
      itemName: item.item_name,
      category: itemCategoryMap.get(item.item_id) ?? "-",
      qty: item.qty,
      unit: item.qty === 1 ? "unit" : "units",
      moveOut: "",
      moveIn: "",
      sign: picName,
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
        moveOut: "",
        moveIn: "",
        sign: picName,
      });
    });
  });

  return rows;
};

const _buildPayload = (
  orderId: string,
  status: number,
  rows: ChecklistOrderItemRow[],
  moveOutIds: string[],
  moveInIds: string[],
  checklist?: ApiChecklist,
): ChecklistCreatePayload => ({
  order_id: orderId,
  status,
  items: rows.map((row) => ({
    item_id: row.itemId,
    description: checklist?.items.find((entry) => entry.id === row.id)?.description ?? row.itemName,
    qty: row.qty,
    move_out: moveOutIds.includes(row.id),
    move_in: moveInIds.includes(row.id),
    sign: row.sign,
  })),
});

/** Manage create and edit checklist state. @returns {ChecklistCreateFormState} Checklist form state. */
export const useItemChecklistCreate = (): ChecklistCreateFormState => {
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
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [moveOutItemIds, setMoveOutItemIds] = useState<string[]>([]);
  const [moveInItemIds, setMoveInItemIds] = useState<string[]>([]);
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
  const checklist = detailQuery.data?.status ? detailQuery.data.data : null;

  const orderItems = useMemo(() => {
    if (isEditMode && checklist) {
      return _getChecklistItems(checklist, itemCategoryMap);
    }

    return _getOrderItems(selectedOrder, itemCategoryMap);
  }, [isEditMode, checklist, selectedOrder, itemCategoryMap]);

  useEffect((): void => {
    if (!id || !checklist || initializedChecklistId.current === id) return;

    initializedChecklistId.current = id;
    setSelectedOrderId(checklist.order_id);
    setMoveOutItemIds(checklist.items.filter((item) => item.move_out).map((item) => item.id));
    setMoveInItemIds(checklist.items.filter((item) => item.move_in).map((item) => item.id));
  }, [id, checklist]);

  const filteredOrderItems = useMemo(() => {
    if (!searchTerm.trim()) return orderItems;
    const lower = searchTerm.toLowerCase();

    return orderItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.sign.toLowerCase().includes(lower),
    );
  }, [orderItems, searchTerm]);

  const handleOrderChange = (value: string): void => {
    setSelectedOrderId(value);
    setMoveOutItemIds([]);
    setMoveInItemIds([]);
    setSearchTerm("");
    setSaveErrorMessage(null);
  };

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };

  const toggleItemId = (itemIds: string[], id: string): string[] =>
    itemIds.includes(id) ? itemIds.filter((itemId) => itemId !== id) : [...itemIds, id];

  const onToggleMoveOut = (id: string): void => {
    setMoveOutItemIds((prev) => toggleItemId(prev, id));
  };

  const onToggleMoveIn = (id: string): void => {
    setMoveInItemIds((prev) => toggleItemId(prev, id));
  };

  const handleSave = async (): Promise<void> => {
    if (isEditMode && (!checklist || !id)) {
      setSaveErrorMessage("Unable to load item checklist.");
      return;
    }

    if (!isEditMode && !selectedOrder) {
      setSaveErrorMessage("Please select a rental order first.");
      return;
    }

    setSaveErrorMessage(null);

    const payload = _buildPayload(
      checklist?.order_id ?? selectedOrderId,
      checklist?.status ?? 1,
      orderItems,
      moveOutItemIds,
      moveInItemIds,
      checklist ?? undefined,
    );

    const result = isEditMode && id
      ? await updateChecklist({ id, body: payload })
      : await createChecklist(payload);
    if (result.error) {
      const apiMessage = "data" in result.error ? result.error.data : result.error.message;
      setSaveErrorMessage(
        Array.isArray(apiMessage) ? apiMessage.join(" ") : apiMessage ?? "Unable to save item checklist.",
      );
      return;
    }

    if (!result.data?.status) {
      setSaveErrorMessage(result.data?.messages.join(" ") || "Unable to save item checklist.");
      return;
    }

    const checklistName = checklist?.checklist_no ?? selectedOrder?.order_no ?? id ?? "Item Checklist";
    if (isEditMode) {
      await logEdit(checklistName);
    } else {
      await logCreate(checklistName);
    }

    void navigate("/item-checklist");
  };

  const goBack = (): void => {
    void navigate("/item-checklist");
  };

  let loadErrorMessage: string | null = null;
  if (isEditMode && (!id || detailQuery.error || (detailQuery.data && !detailQuery.data.status))) {
    loadErrorMessage = "Unable to load item checklist.";
  } else if (!isEditMode && ordersQuery.error) {
    loadErrorMessage = "Unable to load rental orders.";
  }
  const errorMessage = saveErrorMessage ?? loadErrorMessage;

  return {
    orderOptions,
    isOrdersLoading: !isEditMode && ordersQuery.isLoading,
    isLoadingInitialData: isEditMode && detailQuery.isLoading,
    isEditMode,
    selectedOrderId,
    orderItems,
    filteredOrderItems,
    moveOutItemIds,
    moveInItemIds,
    searchTerm,
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    handleOrderChange,
    handleSearchChange,
    onToggleMoveOut,
    onToggleMoveIn,
    handleSave,
    goBack,
  };
};
