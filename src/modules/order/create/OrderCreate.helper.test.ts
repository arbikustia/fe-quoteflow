import type { OrderItemPayload } from "../Order.type";

import { EMPTY_ITEM } from "./OrderCreate.config";
import { createFormActions, resolveSubmitRoute, submitOrder, updateSelectedItem } from "./OrderCreate.helper";
import type { ActionResult, FormActionOptions, OrderCreateFormState, OrderItemOption, OrderProjectOption, SubmitOrderParams } from "./OrderCreate.type";

const ROW: OrderItemPayload = {
  item_id: "",
  project_id: null,
  item_name: "",
  qty: 9,
  price: 0,
  subtotal: 0,
  remark: "",
};

describe("updateSelectedItem", (): void => {
  it("should clamp the row quantity to the selected item stock", (): void => {
    const row = updateSelectedItem(ROW, { id: "item-1", name: "Camera", image: null, price: 100000, stock: 4 });

    expect(row.qty).toBe(4);
    expect(row.subtotal).toBe(400000);
  });

  it("should keep the row quantity when stock is unknown", (): void => {
    const row = updateSelectedItem(ROW, { id: "item-1", name: "Camera", image: null, price: 100000, stock: null });

    expect(row.qty).toBe(9);
  });
});

const FORM = {
  rental_transaction_items: [] as OrderItemPayload[],
  service_type_name: "RENTAL",
  start_at: "2026-11-13T06:00",
  end_at: "2026-11-14T06:00",
  event_name: "Annual Meeting",
} as OrderCreateFormState;
const CAMERA: OrderItemOption = { id: "i1", name: "Camera", image: null, price: 100, stock: 3 };
const PROJECT: OrderProjectOption = { id: "pr1", name: "Package", price: 500, items: [{ item_id: "i1", item_name: "Camera", qty: 2 }] };
const OPTIONS: FormActionOptions = {
  serviceTypes: [{ id: "s1", name: "PROJECT" }],
  items: [CAMERA],
  customers: [{ id: "c1", name: "Acme", address: "Jakarta", phone_number: "0812" }],
  vouchers: [{ id: "v1", name: "Promo", discount_percent: 10 }],
  projects: [PROJECT],
};

/**
 * Create actions over a form kept in a local variable.
 * @param {OrderCreateFormState} initial - Initial form
 * @returns {{ actions: ActionResult; getForm: () => OrderCreateFormState }} - Actions and form reader
 */
const setup = (initial: OrderCreateFormState): { actions: ActionResult; getForm: () => OrderCreateFormState } => {
  let form = initial;
  const setForm = (update: unknown): void => {
    form = typeof update === "function" ? (update as (previous: OrderCreateFormState) => OrderCreateFormState)(form) : (update as OrderCreateFormState);
  };

  return { actions: createFormActions(setForm, OPTIONS), getForm: (): OrderCreateFormState => form };
};

describe("createFormActions", (): void => {
  it("should toggle, select, change and remove item rows", (): void => {
    const { actions, getForm } = setup(FORM);

    actions.onToggleItem("i1");
    expect(getForm().rental_transaction_items[0]).toMatchObject({ item_id: "i1", qty: 1, subtotal: 100 });

    actions.onItemChange(0, "qty", 9);
    expect(getForm().rental_transaction_items[0].qty).toBe(3);

    actions.onItemChange(0, "remark", "Careful");
    actions.onProjectSelect(0, "pr1");
    expect(getForm().rental_transaction_items[0]).toMatchObject({ remark: "Careful", project_id: "pr1" });

    actions.onAddItem();
    actions.onItemSelect(1, "i1");
    expect(getForm().rental_transaction_items).toHaveLength(2);

    actions.onRemoveItem(1);
    actions.onToggleItem("i1");
    expect(getForm().rental_transaction_items).toHaveLength(0);
  });

  it("should toggle project rows", (): void => {
    const { actions, getForm } = setup(FORM);

    actions.onToggleProject("pr1");
    expect(getForm().rental_transaction_items).toHaveLength(2);

    actions.onToggleProject("missing");
    actions.onToggleProject("pr1");
    expect(getForm().rental_transaction_items).toHaveLength(0);
  });

  it("should apply option selections", (): void => {
    const { actions, getForm } = setup(FORM);

    actions.onCustomerChange("c1");
    actions.onVoucherChange("v1");
    actions.onServiceTypeChange("s1");
    actions.onChange("event_name", "Gala");

    expect(getForm()).toMatchObject({ customer_name: "Acme", discount: 10, service_type_name: "PROJECT", event_name: "Gala" });

    actions.onVoucherChange("");
    expect(getForm()).toMatchObject({ voucher_id: null, discount: 0 });
  });

  it("should expose the select and handover handlers", (): void => {
    const { actions } = setup(FORM);

    expect(typeof actions.onPicChange).toBe("function");
    expect(typeof actions.onOrderTypeChange).toBe("function");
    expect(typeof actions.onHandoverTypeChange).toBe("function");
  });
});

describe("resolveSubmitRoute", (): void => {
  it("should route to the return url, back, or the quotation list", (): void => {
    const navigate = jest.fn();

    resolveSubmitRoute(navigate, "1", "/back");
    resolveSubmitRoute(navigate, "1");
    resolveSubmitRoute(navigate);

    expect(navigate.mock.calls).toEqual([["/back"], [-1], ["/document/quotation"]]);
  });
});

describe("submitOrder", (): void => {
  /**
   * Build submit params with spies.
   * @param {Partial<SubmitOrderParams>} [overrides] - Params to override
   * @returns {SubmitOrderParams} - Submit params
   */
  const buildParams = (overrides?: Partial<SubmitOrderParams>): SubmitOrderParams => {
    const ok = { unwrap: jest.fn().mockResolvedValue({ status: true }) };

    return {
      form: { ...FORM, order_type_id: "o1", rental_transaction_items: [{ ...EMPTY_ITEM, item_id: "i1", item_name: "Camera", price: 100 }] },
      orderTypes: [{ id: "o1", name: "Delivery", is_handover: false }],
      projects: [PROJECT],
      createOrder: jest.fn().mockReturnValue(ok),
      createProjectOrder: jest.fn().mockReturnValue(ok),
      updateOrder: jest.fn().mockReturnValue(ok),
      createActivityLog: jest.fn().mockReturnValue(ok),
      navigate: jest.fn(),
      setErrorMessage: jest.fn(),
      ...overrides,
    };
  };

  beforeEach((): void => {
    localStorage.setItem("username", "tester");
  });

  it("should create the order and navigate away", async (): Promise<void> => {
    const params = buildParams();

    await submitOrder(params);

    expect(params.createOrder).toHaveBeenCalledTimes(1);
    expect(params.navigate).toHaveBeenCalledWith("/document/quotation");
  });

  it("should update the order when editing and ignore activity log failures", async (): Promise<void> => {
    const params = buildParams({ id: "order-1", createActivityLog: jest.fn().mockReturnValue({ unwrap: jest.fn().mockRejectedValue(new Error("log")) }) });

    await submitOrder(params);

    expect(params.updateOrder).toHaveBeenCalledTimes(1);
    expect(params.navigate).toHaveBeenCalledWith(-1);
  });

  it("should create a project order or ask for a project when none has items", async (): Promise<void> => {
    const projectForm = { ...FORM, order_type_id: "o1", service_type_name: "PROJECT", rental_transaction_items: [{ ...EMPTY_ITEM, item_id: "pr1", project_id: "pr1", price: 500 }] };
    const projectParams = buildParams({ form: projectForm });

    await submitOrder(projectParams);
    expect(projectParams.createProjectOrder).toHaveBeenCalledTimes(1);

    const emptyParams = buildParams({ form: { ...projectForm, rental_transaction_items: [] }, projects: [] });

    await submitOrder(emptyParams);
    expect(emptyParams.setErrorMessage).toHaveBeenCalledWith("Please select at least one project with items.");
    expect(emptyParams.navigate).not.toHaveBeenCalled();
  });
});
