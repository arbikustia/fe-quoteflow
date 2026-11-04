import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { OrderCreateComponent } from "./OrderCreate.component";
import type { OrderCreateProps } from "./OrderCreate.type";

const props: OrderCreateProps = {
  form: { customer_id: "", pic_id: "", voucher_id: "", service_type_id: "", order_type_id: "", handover_type: "", handover_name: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: "", end_at: "", subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [] },
  customers: [], pics: [], serviceTypes: [], orderTypes: [], vouchers: [], projects: [], items: [],
  isCustomersLoading: false, isPicsLoading: false, isServiceTypesLoading: false, isOrderTypesLoading: false, isVouchersLoading: false, isProjectsLoading: false, isItemsLoading: false,
  isEdit: false, isSubmitting: false, errorMessage: null, showInformationErrors: false, showItemErrors: false, step: 1,
  onBack: jest.fn(), onNextStep: jest.fn(), onPreviousStep: jest.fn(), onCustomerChange: jest.fn(), onPicChange: jest.fn(), onVoucherChange: jest.fn(), onServiceTypeChange: jest.fn(), onOrderTypeChange: jest.fn(), onHandoverTypeChange: jest.fn(), onProjectSelect: jest.fn(), onItemSelect: jest.fn(), onToggleItem: jest.fn(), onToggleProject: jest.fn(), onChange: jest.fn(), onItemChange: jest.fn(), onAddItem: jest.fn(), onRemoveItem: jest.fn(), onSubmit: jest.fn(), onPreventSubmit: jest.fn(),
};

describe("OrderCreateComponent", (): void => {
  it("should render order information step", (): void => {
    render(<MemoryRouter><OrderCreateComponent {...props} /></MemoryRouter>);

    expect(screen.getByText("Order Information")).toBeTruthy();
  });

  it("should let selected rental items edit quantity and remark", (): void => {
    const onItemChange = jest.fn();
    render(
      <MemoryRouter>
        <OrderCreateComponent
          {...props}
          step={2}
          items={[{ id: "item-1", name: "Camera", image: null, price: 100000, stock: 5 }]}
          form={{
            ...props.form,
            rental_transaction_items: [{ item_id: "item-1", item_name: "Camera", project_id: "", qty: 1, price: 100000, subtotal: 100000, remark: "" }],
          }}
          onItemChange={onItemChange}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Select Camera")).toBeTruthy();
    expect(screen.getAllByLabelText("Qty")).toHaveLength(2);
    fireEvent.change(screen.getAllByLabelText("Qty")[1], { target: { value: "2" } });
    fireEvent.change(screen.getAllByLabelText("Remark")[1], { target: { value: "Tripod" } });
    expect(onItemChange).toHaveBeenCalledWith(0, "qty", 2);
    expect(onItemChange).toHaveBeenCalledWith(0, "remark", "Tripod");
  });

  it("should show error when end date is earlier than start date", (): void => {
    render(
      <MemoryRouter>
        <OrderCreateComponent
          {...props}
          form={{ ...props.form, start_at: "2026-11-08T06:00", end_at: "2026-11-01T06:00" }}
          showInformationErrors
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("End date cannot be earlier than start date")).toBeTruthy();
  });
});
