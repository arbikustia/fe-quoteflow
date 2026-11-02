import { useNavigate, useParams } from "react-router-dom";

import { useGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";

import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";
import { downloadChecklistPdf } from "../ItemChecklist.pdf";

/** Get checklist detail page state. */
export const useItemChecklistDetail = (): ItemChecklistDetailState => {
  const navigate = useNavigate();
  const { id = "" } = useParams<{ id: string }>();
  const query = useGetRentalChecklistByIdQuery(id, { skip: !id });
  let errorMessage: string | null = null;

  if (!id || query.error) {
    errorMessage = "Unable to load item checklist.";
  } else if (query.data && !query.data.status) {
    errorMessage = query.data.messages.join(" ");
  }

  const goBack = (): void => { void navigate("/item-checklist"); };
  const goEdit = (): void => { if (id) void navigate(`/item-checklist/create/${id}`); };
  const onDownload = (): void => {
    if (query.data?.data) {
      downloadChecklistPdf(query.data.data);
    }
  };

  return { checklist: query.data?.data ?? null, isLoading: query.isLoading, errorMessage, goBack, goEdit, onDownload };
};
