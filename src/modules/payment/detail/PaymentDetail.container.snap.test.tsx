import type * as React from "react";

import test from "@/libs/unit-test";

import PaymentDetailContainer from "./PaymentDetail.container";

jest.mock("./PaymentDetail.hook", () => ({ usePaymentDetail: (): Record<string, never> => ({}) }));
jest.mock("./PaymentDetail.component", () => ({
  PaymentDetailComponent: (): React.ReactElement => <div>PaymentDetailContainer rendered</div>,
}));

test.assertSnapshots(PaymentDetailContainer, [{ props: {}, desc: "should render the module component" }]);
