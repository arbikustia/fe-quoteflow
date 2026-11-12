import { fireEvent, render, screen } from "@/libs/unit-test";

import { _createEditClickHandler, getCustomerColumns, getCustomerRowKey, renderCustomerMobileCard } from "./MasterCustomer.helper";
import type { CustomerData } from "./MasterCustomer.type";

const CUSTOMER: CustomerData = {
  id: "1",
  name: "PT Mega Jaya Abadi",
  email: "admin@megajaya.com",
  address: "Jl. Sudirman No. 45",
  phoneNumber: "081234567890",
  status: "inactive",
};

describe("MasterCustomer helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(CUSTOMER, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(CUSTOMER);
  });

  it("should build columns that render row number, status and edit action", () => {
    const onEdit = jest.fn();
    const columns = getCustomerColumns(2, 10, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "email", "address", "phoneNumber", "status", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(CUSTOMER, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    fireEvent.click(screen.getByRole("button", { name: "Edit customer" }));
    expect(onEdit).toHaveBeenCalledWith(CUSTOMER);
  });

  it("should use the customer id as the row key", () => {
    expect(getCustomerRowKey(CUSTOMER)).toBe("1");
  });

  it("should render a mobile card that opens edit", () => {
    const onEdit = jest.fn();

    render(renderCustomerMobileCard({ customer: CUSTOMER, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("081234567890")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(CUSTOMER);
  });
});
