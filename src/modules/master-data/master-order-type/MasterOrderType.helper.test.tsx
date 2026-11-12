import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getOrderTypeColumns,
  getOrderTypeRowKey,
  renderOrderTypeMobileCard,
} from "./MasterOrderType.helper";
import type { OrderTypeData } from "./MasterOrderType.type";

const ORDER_TYPE: OrderTypeData = {
  id: "order-type-1",
  name: "Delivery",
  isHandover: "yes",
  status: "inactive",
  createdAt: "30 Oktober 2026 21:09",
};

describe("MasterOrderType helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(ORDER_TYPE, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(ORDER_TYPE);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getOrderTypeColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "isHandover", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(ORDER_TYPE, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("yes")).toHaveClass("bg-information-subtle");
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("30 Oktober 2026 21:09")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit order type Delivery" }));
    expect(onEdit).toHaveBeenCalledWith(ORDER_TYPE);
  });

  it("should hide the action column without edit permission", () => {
    expect(getOrderTypeColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the order type id as the row key", () => {
    expect(getOrderTypeRowKey(ORDER_TYPE)).toBe("order-type-1");
  });

  it("should render a mobile card that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderOrderTypeMobileCard({ orderType: { ...ORDER_TYPE, isHandover: "no" }, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("No Handover")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith({ ...ORDER_TYPE, isHandover: "no" });
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderOrderTypeMobileCard({ orderType: ORDER_TYPE, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Handover Required")).toBeInTheDocument();
  });
});
