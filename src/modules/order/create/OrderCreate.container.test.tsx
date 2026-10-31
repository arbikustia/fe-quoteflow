import { describe, expect, it, jest } from "@jest/globals";

import { render, screen } from "@/libs/unit-test";

import OrderCreateContainer from "./OrderCreate.container";
import { useOrderCreateLogic } from "./OrderCreate.hook";
import type { OrderCreateState } from "./OrderCreate.type";

jest.mock("./OrderCreate.hook", () => ({ useOrderCreateLogic: jest.fn() }));
jest.mock("./OrderCreate.component", () => ({ OrderCreateComponent: (): React.ReactElement => <div>Order create form</div> }));

const state: OrderCreateState = {
  form: { customer_id: "", pic_id: "", voucher_id: "", service_type_id: "", order_type_id: "", handover_type: "", handover_name: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: "", end_at: "", subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [] },
  customers: [], pics: [], serviceTypes: [], orderTypes: [], vouchers: [], projects: [], items: [], isCustomersLoading: false, isPicsLoading: false, isServiceTypesLoading: false, isOrderTypesLoading: false, isVouchersLoading: false, isProjectsLoading: false, isItemsLoading: false, isEdit: false, isSubmitting: false, errorMessage: null, showInformationErrors: false, showItemErrors: false, step: 1,
  onBack: jest.fn(), onNextStep: jest.fn(), onPreviousStep: jest.fn(), onCustomerChange: jest.fn(), onPicChange: jest.fn(), onVoucherChange: jest.fn(), onServiceTypeChange: jest.fn(), onOrderTypeChange: jest.fn(), onHandoverTypeChange: jest.fn(), onProjectSelect: jest.fn(), onItemSelect: jest.fn(), onToggleItem: jest.fn(), onToggleProject: jest.fn(), onChange: jest.fn(), onItemChange: jest.fn(), onAddItem: jest.fn(), onRemoveItem: jest.fn(), onSubmit: jest.fn(), onPreventSubmit: jest.fn(),
};

describe("OrderCreateContainer", (): void => {
  it("should render component using hook state", (): void => {
    jest.mocked(useOrderCreateLogic).mockReturnValue(state);

    render(<OrderCreateContainer />);

    expect(screen.getByText("Order create form")).toBeTruthy();
  });
});
