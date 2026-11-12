import type * as React from "react";

import test from "@/libs/unit-test";

import OrderCreateContainer from "./OrderCreate.container";

jest.mock("./OrderCreate.hook", () => ({
  /**
   * Return empty order-create state for the snapshot.
   * @returns {Record<string, never>} - Empty state
   */
  useOrderCreateLogic: (): Record<string, never> => ({}),
}));
jest.mock("./OrderCreate.component", () => ({
  /**
   * Render the mocked order-create form.
   * @returns {React.ReactElement} - Mocked form
   */
  OrderCreateComponent: (): React.ReactElement => <div>Order create form</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({
  /**
   * Allow order creation.
   * @returns {{ canCreate: boolean }} - Permission
   */
  usePagePermission: (): { canCreate: boolean } => ({ canCreate: true }),
}));

test.assertSnapshots(OrderCreateContainer, [{ props: {}, desc: "should render the order create form" }]);
