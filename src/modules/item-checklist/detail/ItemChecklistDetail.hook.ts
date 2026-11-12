import { useNavigate, useParams } from "react-router-dom";

import { downloadChecklistPdf } from "../ItemChecklist.pdf";

import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";

import { useGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

/**
 * Get checklist detail page state.
 * @returns {ItemChecklistDetailState} - detail state
 */
export const useItemChecklistDetail = (): ItemChecklistDetailState => {
  const navigate = useNavigate();
  const { id = "" } = useParams<{ id: string }>();
  const query = useGetRentalChecklistByIdQuery(id, { skip: !id });
  const ordersQuery = useGetRentalOrderOptionsQuery();
  let errorMessage: string | null = null;

  if (!id || query.error) {
    errorMessage = "Unable to load item checklist.";
  } else if (query.data && !query.data.status) {
    errorMessage = query.data.messages.join(" ");
  }

  /**
   * Return to the checklist list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/item-checklist"); };
  /**
   * Open the checklist edit page.
   * @returns {void} No return value
   */
  const goEdit = (): void => { if (id) void navigate(`/item-checklist/create/${id}`); };
  /**
   * Download the checklist PDF.
   * @returns {void} No return value
   */
  const onDownload = (): void => {
    const checklist = query.data?.data;
    const order = checklist && ordersQuery.data?.status
      ? ordersQuery.data.data.find((entry) => entry.id === checklist.order_id)
      : undefined;

    if (!checklist || !order) {
      window.alert("Unable to download item checklist. Rental order data is unavailable.");

      return;
    }

    downloadChecklistPdf(checklist, order);
  };

  return { checklist: query.data?.data ?? null, isLoading: query.isLoading, errorMessage, goBack, goEdit, onDownload };
};
