import { MOCK_API_PAYMENT_METHODS } from "@/fixture/master-payment-method";
import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getPaymentMethodColumns,
  getPaymentMethodRowKey,
  renderPaymentMethodMobileCard,
} from "./MasterPaymentMethod.helper";
import type { PaymentMethodData } from "./MasterPaymentMethod.type";

const PAYMENT_METHOD: PaymentMethodData = {
  id: "payment-method-1",
  name: "BCA",
  description: "No Admin Fee",
  status: "inactive",
  createdAt: "30 Oktober 2026 22:00",
  source: MOCK_API_PAYMENT_METHODS[0],
};

describe("MasterPaymentMethod helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(PAYMENT_METHOD, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(PAYMENT_METHOD);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getPaymentMethodColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "description", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(PAYMENT_METHOD, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("BCA")).toBeInTheDocument();
    expect(screen.getByText("No Admin Fee")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit payment method BCA" }));
    expect(onEdit).toHaveBeenCalledWith(PAYMENT_METHOD);
  });

  it("should hide the action column without edit permission", () => {
    expect(getPaymentMethodColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the payment method id as the row key", () => {
    expect(getPaymentMethodRowKey(PAYMENT_METHOD)).toBe("payment-method-1");
  });

  it("should render a mobile card with the description that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderPaymentMethodMobileCard({ paymentMethod: PAYMENT_METHOD, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("No Admin Fee")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(PAYMENT_METHOD);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderPaymentMethodMobileCard({ paymentMethod: PAYMENT_METHOD, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
