import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { OrderCreateComponent } from "./OrderCreate.component";
import type { OrderCreateProps } from "./OrderCreate.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   * @param {React.PropsWithChildren} props - Layout props.
   * @returns {React.ReactElement} Wrapper element.
   */
  default: (props: React.PropsWithChildren): React.ReactElement => <div>{props.children}</div>,
}));

const props: OrderCreateProps = {
  form: { customer_id: "", pic_id: "", voucher_id: null, service_type_id: "", order_type_id: "", handover_type: "", handover_name: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: "", end_at: "", subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [] },
  customers: [], pics: [], serviceTypes: [], orderTypes: [], vouchers: [], projects: [], items: [],
  isCustomersLoading: false, isPicsLoading: false, isServiceTypesLoading: false, isOrderTypesLoading: false, isVouchersLoading: false, isProjectsLoading: false, isItemsLoading: false,
  isEdit: false, isSubmitting: false, errorMessage: null, showInformationErrors: false, showItemErrors: false, step: 1,
  onBack: jest.fn(), onNextStep: jest.fn(), onPreviousStep: jest.fn(), onCustomerChange: jest.fn(), onPicChange: jest.fn(), onVoucherChange: jest.fn(), onVoucherSearch: jest.fn(), onServiceTypeChange: jest.fn(), onOrderTypeChange: jest.fn(), onHandoverTypeChange: jest.fn(), onProjectSelect: jest.fn(), onItemSelect: jest.fn(), onToggleItem: jest.fn(), onToggleProject: jest.fn(), onChange: jest.fn(), onItemChange: jest.fn(), onAddItem: jest.fn(), onRemoveItem: jest.fn(), onSubmit: jest.fn(), onPreventSubmit: jest.fn(),
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
    fireEvent.click(screen.getAllByRole("button", { name: "Increase Camera quantity" })[0]);
    expect((screen.getAllByRole("button", { name: "Decrease Camera quantity" })[0] as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getAllByLabelText("Remark")[1], { target: { value: "Tripod" } });
    expect(onItemChange).toHaveBeenCalledWith(0, "qty", 2);
    expect(onItemChange).toHaveBeenCalledWith(0, "remark", "Tripod");
  });

  it("should cap entered item quantity at available stock", (): void => {
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

    fireEvent.change(screen.getAllByLabelText("Qty")[1], { target: { value: "8" } });

    expect(onItemChange).toHaveBeenCalledWith(0, "qty", 5);
  });

  it("should edit one project remark instead of item remarks", (): void => {
    const onItemChange = jest.fn();
    render(
      <MemoryRouter>
        <OrderCreateComponent
          {...props}
          step={2}
          projects={[
            {
              id: "project-1",
              name: "Lighting Package",
              price: 1000000,
              items: [
                { item_id: "item-1", item_name: "Beam 290", qty: 1 },
                { item_id: "item-2", item_name: "Beam 450", qty: 1 },
              ],
            },
          ]}
          form={{
            ...props.form,
            service_type_name: "PROJECT",
            rental_transaction_items: [
              { item_id: "project-1", project_id: "project-1", item_name: "Lighting Package", qty: 1, price: 1000000, subtotal: 1000000, remark: "Delivery" },
              { item_id: "item-1", project_id: "project-1", item_name: "Beam 290", qty: 1, price: 0, subtotal: 0, remark: "" },
              { item_id: "item-2", project_id: "project-1", item_name: "Beam 450", qty: 1, price: 0, subtotal: 0, remark: "" },
            ],
          }}
          onItemChange={onItemChange}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText("Remark Beam 290")).toBeNull();
    expect(screen.queryByLabelText("Remark Beam 450")).toBeNull();
    const projectRemark = screen.getByLabelText("Project Remark");
    expect((projectRemark as HTMLTextAreaElement).value).toBe("Delivery");
    fireEvent.change(projectRemark, { target: { value: "Pickup" } });
    expect(onItemChange).toHaveBeenCalledTimes(1);
    expect(onItemChange).toHaveBeenCalledWith(0, "remark", "Pickup");
  });

  it("should show percentage discount as a calculated Rupiah amount in review", (): void => {
    render(
      <MemoryRouter>
        <OrderCreateComponent
          {...props}
          step={3}
          form={{
            ...props.form,
            discount: 8,
            service_fee: 25000,
            start_at: "2026-11-12T06:00",
            end_at: "2026-11-14T06:00",
            rental_transaction_items: [
              { item_id: "item-1", item_name: "Camera", project_id: "", qty: 1, price: 625000, subtotal: 625000, remark: "" },
            ],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Rp 150.000 (8%)")).toBeTruthy();
    expect(screen.getByText("Rp 1.750.000")).toBeTruthy();
    expect(screen.getByText("Rp 1.875.000")).toBeTruthy();
    expect(screen.getByText("12 November 2026")).toBeTruthy();
    expect(screen.getByText("14 November 2026")).toBeTruthy();
    const customerSection = screen.getByText("Customer Information").parentElement?.parentElement?.parentElement;
    const pricingSection = screen.getByText("Pricing").parentElement?.parentElement?.parentElement?.parentElement;
    const rentalSection = screen.getByRole("heading", { name: "Rental Items" }).parentElement;
    expect(customerSection?.className).toContain("rounded-2xl");
    expect(customerSection?.className).not.toContain("border-t");
    expect(customerSection?.parentElement?.className).not.toContain("lg:grid-cols-12");
    const orderSectionTitle = screen.getAllByText("Order Information").find((element) => element.tagName === "P");
    const orderSection = orderSectionTitle?.parentElement?.parentElement?.parentElement;
    expect(orderSection?.className).not.toContain("lg:col-span-6");
    expect(customerSection?.querySelector("dl")?.className).toContain("sm:grid-cols-3");
    expect(orderSection?.querySelector("dl")?.className).toContain("sm:grid-cols-3");
    expect(customerSection?.querySelector("dt")?.nextElementSibling?.className).toContain("mt-1");
    expect(orderSection?.querySelector("dt")?.nextElementSibling?.className).toContain("mt-1");
    expect(screen.getByText("Address").parentElement?.className).not.toContain("border-b");
    expect(screen.getByText("End").parentElement?.className).not.toContain("border-b");
    expect(pricingSection?.className).toContain("rounded-2xl");
    expect(pricingSection?.className).not.toContain("border-y");
    expect(pricingSection?.className).not.toContain("lg:order-2");
    expect(rentalSection?.className).toContain("rounded-2xl");
    expect(rentalSection?.className).not.toContain("lg:order-3");
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
