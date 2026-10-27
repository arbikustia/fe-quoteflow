import { useNavigate, useParams } from "react-router-dom";

import { MOCK_INVOICES } from "@/fixture/invoices";

import type { InvoiceDetailState } from "../Invoice.type";

import { useGetInvoiceByIdQuery } from "@/services/invoice.service";

/**
 * Load invoice detail and expose navigation.
 * @returns {InvoiceDetailState} - invoice detail state
 */
export const useInvoiceDetail = (): InvoiceDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetInvoiceByIdQuery(id ?? "", { skip: !id });
  const fixtureInvoice = MOCK_INVOICES.find((invoice) => invoice.id === id) ?? null;
  const invoice = data?.status && data.data ? data.data : fixtureInvoice;
  const errorMessage = !isLoading && !invoice ? "Invoice detail is unavailable." : null;

  /**
   * Navigate back from invoice detail.
   * @returns {void} - no return value
   */
  const goBack = (): void => { void navigate(-1); };

  return { invoice, isLoading, errorMessage, goBack };
};
