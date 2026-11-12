import test from "@/libs/unit-test";

import { PaymentStatusForm } from "./PaymentStatus.component";
import type { PaymentStatusFormProps } from "./PaymentStatus.type";

const props: PaymentStatusFormProps = {
  referenceNo: "REF-001",
  isActive: true,
  isLoading: false,
  isSubmitting: false,
  errorMessage: null,
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn((): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
};

test.assertSnapshots(PaymentStatusForm, [
  { props, desc: "should render the active status form" },
  { props: { ...props, isActive: false, errorMessage: "Failed" }, desc: "should render the inactive status form with error" },
]);
