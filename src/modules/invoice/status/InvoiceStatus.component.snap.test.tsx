import test from "@/libs/unit-test";

import { InvoiceStatusForm } from "./InvoiceStatus.component";
import type { InvoiceStatusFormProps } from "./InvoiceStatus.type";

const props: InvoiceStatusFormProps = {
  invoiceNumber: "INV-001",
  isActive: true,
  isLoading: false,
  isSubmitting: false,
  errorMessage: null,
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn((): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
};

test.assertSnapshots(InvoiceStatusForm, [
  { props, desc: "should render the active status form" },
  { props: { ...props, isActive: false, errorMessage: "Failed" }, desc: "should render the inactive status form with error" },
]);
