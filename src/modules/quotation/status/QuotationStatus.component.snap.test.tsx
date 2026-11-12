import test from "@/libs/unit-test";

import { QuotationStatusForm } from "./QuotationStatus.component";
import type { QuotationStatusFormProps } from "./QuotationStatus.type";

const PROPS: QuotationStatusFormProps = {
  quotationNumber: "QUO-001",
  isApproved: false,
  isLoading: false,
  isSubmitting: false,
  errorMessage: null,
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

test.assertSnapshots(QuotationStatusForm, [
  { props: PROPS, desc: "should render the status form" },
  { props: { ...PROPS, isLoading: true }, desc: "should render the loading state" },
  { props: { ...PROPS, isApproved: true, isSubmitting: true, errorMessage: "Failed" }, desc: "should render the submitting state with an error" },
]);
