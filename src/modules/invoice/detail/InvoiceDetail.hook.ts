import { useNavigate, useParams } from "react-router-dom";

import { useGetInvoiceByIdQuery } from "@/services/invoice.service";

import type { InvoiceDetailState } from "../Invoice.type";

/** Load invoice detail and expose navigation. */
export const useInvoiceDetail = (): InvoiceDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id ?? "", { skip: !id });
  const invoice = data?.status && data.data ? data.data : null;
  let errorMessage: string | null = null;

  if (error) {
    errorMessage = "Unable to load invoice detail.";
  } else if (data && !data.status) {
    errorMessage = "Invoice detail is unavailable.";
  }

  const goBack = (): void => { void navigate(-1); };

  return { invoice, isLoading, errorMessage, goBack };
};