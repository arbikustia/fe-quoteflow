import type * as React from "react";

import test from "@/libs/unit-test";

import PaymentContainer from "./Payment.container";

jest.mock("./Payment.hook", () => ({ usePaymentPagination: (): Record<string, never> => ({}), usePaymentNavigation: (): Record<string, never> => ({}) }));
jest.mock("./Payment.component", () => ({
  PaymentComponent: (): React.ReactElement => <div>PaymentContainer rendered</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canCreate: boolean } => ({ canCreate: true }) }));

test.assertSnapshots(PaymentContainer, [{ props: {}, desc: "should render the module component" }]);
