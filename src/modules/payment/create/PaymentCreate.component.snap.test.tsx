import test from "@/libs/unit-test";

import type { PaymentCreateFormState } from "../Payment.type";

import { PaymentCreateComponent } from "./PaymentCreate.component";

const props: PaymentCreateFormState = {
  invoices: [{ id: "inv-1", invoice_no: "INV-001" }],
  paymentMethods: [{ id: "pm-1", name: "Bank Transfer" }],
  invoiceId: "inv-1",
  paymentMethodId: "pm-1",
  status: "1",
  amount: 1500000,
  paidAt: "",
  referenceNo: "REF-001",
  notes: "Notes",
  isLoadingOptions: false,
  isSubmitting: false,
  errorMessage: null,
  isSubmitted: false,
  isEditMode: false,
  isActive: true,
  handleSubmit: jest.fn((): Promise<void> => Promise.resolve()),
  setInvoiceId: jest.fn(),
  setPaymentMethodId: jest.fn(),
  setStatus: jest.fn(),
  setAmount: jest.fn(),
  setPaidAt: jest.fn(),
  setReferenceNo: jest.fn(),
  setNotes: jest.fn(),
  handleStatusChange: jest.fn(),
  goBack: jest.fn(),
};

test.assertSnapshots(PaymentCreateComponent, [
  { props, desc: "should render the payment create form" },
  { props: { ...props, isEditMode: true, errorMessage: "Failed" }, desc: "should render the payment edit form with error" },
]);
