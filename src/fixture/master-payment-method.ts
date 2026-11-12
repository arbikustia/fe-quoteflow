import type { ApiPaymentMethod, PaymentMethodListResponse } from "@/modules/master-data/master-payment-method/MasterPaymentMethod.type";

export const MOCK_API_PAYMENT_METHODS: ApiPaymentMethod[] = [
  {
    id: "payment-method-1",
    name: "BCA",
    description: "No Admin Fee",
    status: 1,
    created_by: null,
    created_at: "2026-10-30 22:00:54",
    updated_at: "2026-10-30 22:00:54",
  },
  {
    id: "payment-method-2",
    name: "BRI",
    description: null,
    status: 0,
    created_by: null,
    created_at: null,
    updated_at: null,
  },
];

export const MOCK_PAYMENT_METHOD_LIST_RESPONSE: PaymentMethodListResponse = {
  data: MOCK_API_PAYMENT_METHODS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_PAYMENT_METHODS.length,
  has_previous: false,
  has_next: false,
};
