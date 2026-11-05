import { getUsername } from "../../../../components/Sidebar/Sidebar.helpers";
import { useCreateActivityLogMutation } from "@/services/activity-log.service";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { ApiRentalTransactionDetail, OrderCreatePayload, OrderItemPayload, OrderType, ProjectOrderCreatePayload, ProjectOrderItemPayload, RentalHandoverPayload } from "../../Order.type";
import { calculateOrderTotals, calculateRentalDays, getNextOrderStep, getPreviousOrderStep, hasSelectedOrderItem, isOrderInformationValid } from "../OrderCreate.helpers";
import type { OrderCreateFormState, OrderCreateState, OrderItemOption, OrderProjectOption, SelectOption } from "../OrderCreate.type";

import { useGetAllCustomersQuery } from "@/services/master-customer.service";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useGetAllPicsQuery } from "@/services/master-pic.service";
import { useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetAllServiceTypesQuery } from "@/services/master-service-type.service";
import { useGetAllVouchersQuery, useGetVoucherByCodeQuery } from "@/services/master-voucher.service";
import { useCreateOrderMutation, useCreateProjectOrderMutation, useGetAllOrderTypesQuery, useGetOrderByIdQuery, useUpdateOrderMutation } from "@/services/order.service";

type CustomerOption = SelectOption & { address: string; phone_number: string };
type VoucherOption = SelectOption & { discount_percent: number };
type OrderLocationState = { returnUrl?: string };
type ProjectData = OrderProjectOption;
type FormSetter = React.Dispatch<React.SetStateAction<OrderCreateFormState>>;
type ActionResult = {
  onToggleItem: (itemId: string) => void;
  onToggleProject: (projectId: string) => void;
  onCustomerChange: (customerId: string) => void;
  onPicChange: (picId: string) => void;
  onVoucherChange: (voucherId: string) => void;
  onServiceTypeChange: (serviceTypeId: string) => void;
  onOrderTypeChange: (orderTypeId: string) => void;
  onHandoverTypeChange: (handoverType: string) => void;
  onProjectSelect: (index: number, projectId: string) => void;
  onItemSelect: (index: number, itemId: string) => void;
  onChange: (field: keyof OrderCreateFormState, value: string | number) => void;
  onItemChange: (index: number, field: keyof OrderItemPayload, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

const EMPTY_ITEM: OrderItemPayload = { item_id: "", project_id: null, item_name: "", qty: 1, price: 0, subtotal: 0, remark: "" };

/**
 * Format date for date picker state.
 * @param {Date} date - Date to format.
 * @returns {string} Date formatted for date picker.
 */
const formatDatePickerValue = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

/**
 * Build default order date range.
 * @returns {{ start_at: string; end_at: string }} Today at 06:00 through tomorrow at 06:00.
 */
const getDefaultDateRange = (): { start_at: string; end_at: string } => {
  const start = new Date();
  start.setHours(6, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start_at: formatDatePickerValue(start), end_at: formatDatePickerValue(end) };
};

const DEFAULT_DATE_RANGE = getDefaultDateRange();
const INITIAL_FORM: OrderCreateFormState = { customer_id: "", pic_id: "", voucher_id: "", service_type_id: "", order_type_id: "", handover_type: "", handover_name: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: DEFAULT_DATE_RANGE.start_at, end_at: DEFAULT_DATE_RANGE.end_at, subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [EMPTY_ITEM] };

/**
 * Build edit form item list from order detail.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderItemPayload[]} Form item rows.
 */
const _buildEditFormItems = (order: ApiRentalTransactionDetail): OrderItemPayload[] => {
  const serviceTypeName = (order.service_type_name ?? order.service_type?.name ?? "").trim().toUpperCase();

  if (serviceTypeName === "PROJECT") {
    const projectItems = (order.rental_transaction_project ?? []).flatMap((project) => {
      const headerRemark = project.remark ?? "";
      return [
        {
          item_id: project.id,
          project_id: project.id,
          item_name: project.name,
          qty: 1,
          price: project.price,
          subtotal: project.price,
          remark: headerRemark,
        },
        ...project.items.map((projectItem) => ({
          item_id: projectItem.item_id,
          project_id: project.id,
          item_name: projectItem.item_name,
          qty: projectItem.qty,
          price: 0,
          subtotal: 0,
          remark: "",
        })),
      ];
    });

    return projectItems.length > 0 ? projectItems : [EMPTY_ITEM];
  }

  const regularItems = (order.rental_transaction_items ?? []).map((item) => ({
    item_id: item.item_id,
    project_id: item.project_id ?? null,
    item_name: item.item_name,
    qty: item.qty,
    price: item.price,
    subtotal: item.subtotal,
    remark: item.remark ?? "",
  }));

  return regularItems.length > 0 ? regularItems : [EMPTY_ITEM];
};

/**
 * Build edit form defaults from order detail.
 * @param {ApiRentalTransactionDetail} order - Order detail.
 * @returns {OrderCreateFormState} - Populated edit form.
 */
export const buildEditForm = (order: ApiRentalTransactionDetail): OrderCreateFormState => ({
  customer_id: order.customer_id ?? order.customer?.id ?? "",
  pic_id: order.pic_id ?? order.pic?.id ?? "",
  voucher_id: order.voucher_id ?? order.voucher?.id ?? "",
  service_type_id: order.service_type_id ?? order.service_type?.id ?? "",
  order_type_id: order.order_type_id ?? order.order_type?.id ?? "",
  handover_type: order.rental_handovers?.[0]?.type ?? "",
  handover_name: order.rental_handovers?.[0]?.name ?? "",
  service_type_name: order.service_type_name ?? order.service_type?.name ?? "",
  customer_name: order.customer_name ?? order.customer?.name ?? "",
  customer_phone: order.customer_phone ?? order.customer?.phone_number ?? order.customer?.phone ?? "",
  address: order.address ?? order.customer?.address ?? "",
  event_name: order.event_name ?? "",
  start_at: order.start_at ?? "",
  end_at: order.end_at ?? "",
  subtotal: order.subtotal ?? 0,
  discount: order.discount ?? 0,
  service_fee: order.service_fee ?? 0,
  remarks: order.rental_transaction_project[0]?.remark ?? order.remark ?? order.remarks ?? "",
  grand_total: order.grand_total ?? 0,
  status: order.status ?? 1,
  rental_transaction_items: _buildEditFormItems(order),
});

/**
 * Format date value for order API payload. @param {string} value - date value. @returns {string} formatted date.
 * @param value
 */
const formatOrderDate = (value: string): string => {
  const date = new Date(value);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
};

/**
 * Build selected project payload items. @param {OrderItemPayload[]} items - selected items. @returns {ProjectOrderItemPayload[]} project items.
 * @param items
 */
const buildProjectItems = (items: OrderItemPayload[], projects: ProjectData[], startAt: string, endAt: string): ProjectOrderItemPayload[] => {
  const projectIds = Array.from(new Set(items.map((item) => item.project_id).filter((projectId): projectId is string => Boolean(projectId))));
  const totalDays = calculateRentalDays(startAt, endAt);

  return projectIds.map((projectId) => {
    const projectHeader = items.find(
      (item) => item.project_id === projectId && item.item_id === projectId,
    );
    const price = projects.find((project) => project.id === projectId)?.price ?? 0;
    const subtotal = price * totalDays;

    return { project_id: projectId, qty: 1, price, subtotal, remark: projectHeader?.remark ?? "" };
  });
};

/**
 * Find customer option. @param {CustomerOption[]} customers - customer options. @param {string} customerId - customer ID. @returns {CustomerOption | undefined} matching customer.
 * @param customers
 * @param customerId
 */
const findCustomer = (customers: CustomerOption[], customerId: string): CustomerOption | undefined => customers.find((customer) => customer.id === customerId);

/**
 * Create form action handlers. @param {FormSetter} setForm - form state setter. @param {CustomerOption[]} customers - customer options. @param {VoucherOption[]} vouchers - voucher options. @param {SelectOption[]} serviceTypes - service type options. @param {OrderItemOption[]} items - item options. @param {ProjectData[]} projects - project options. @returns {ActionResult} form action handlers.
 * @param setForm
 * @param customers
 * @param vouchers
 * @param serviceTypes
 * @param items
 * @param projects
 */
const createFormActions = (setForm: FormSetter, customers: CustomerOption[], vouchers: VoucherOption[], serviceTypes: SelectOption[], items: OrderItemOption[], projects: ProjectData[]): ActionResult => {
  /**
   *
   * @param field
   * @param value
   */
  const onChange = (field: keyof OrderCreateFormState, value: string | number): void => setForm((previous) => ({ ...previous, [field]: value }));
  /**
   *
   * @param index
   */
  const onRemoveItem = (index: number): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.filter((_item, itemIndex) => itemIndex !== index) }));
  /**
   *
   */
  const onAddItem = (): void => setForm((previous) => ({ ...previous, rental_transaction_items: [...previous.rental_transaction_items, EMPTY_ITEM] }));
  /**
   *
   * @param picId
   */
  const onPicChange = (picId: string): void => onChange("pic_id", picId);
  /**
   * Set selected order type.
   * @param {string} orderTypeId - Order type ID.
   * @returns {void} Nothing.
   */
  const onOrderTypeChange = (orderTypeId: string): void => onChange("order_type_id", orderTypeId);
  /**
   * Set rental handover identity type.
   * @param {string} handoverType - Identity document type.
   * @returns {void} Nothing.
   */
  const onHandoverTypeChange = (handoverType: string): void => onChange("handover_type", handoverType);
  /**
   *
   * @param customerId
   */
  const onCustomerChange = (customerId: string): void => {
    const customer = findCustomer(customers, customerId);

    if (customer) setForm((previous) => ({ ...previous, customer_id: customer.id, customer_name: customer.name, customer_phone: customer.phone_number, address: customer.address }));
  };
  /**
   *
   * @param voucherId
   */
  const onVoucherChange = (voucherId: string): void => {
    const voucher = vouchers.find((option) => option.id === voucherId);

    setForm((previous) => ({ ...previous, voucher_id: voucherId, discount: voucher?.discount_percent ?? 0 }));
  };
  /**
   *
   * @param serviceTypeId
   */
  const onServiceTypeChange = (serviceTypeId: string): void => {
    const serviceType = serviceTypes.find((option) => option.id === serviceTypeId);
    const serviceTypeName = serviceType?.name ?? "";

    setForm((previous) => ({ ...previous, service_type_id: serviceTypeId, service_type_name: serviceTypeName, rental_transaction_items: serviceTypeName.trim().toUpperCase() === "PROJECT" ? [] : previous.rental_transaction_items.map((item) => ({ ...item, project_id: null })) }));
  };
  /**
   *
   * @param index
   * @param projectId
   */
  const onProjectSelect = (index: number, projectId: string): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => itemIndex === index ? { ...item, project_id: projectId } : item) }));
  /**
   *
   * @param index
   * @param itemId
   */
  const onItemSelect = (index: number, itemId: string): void => {
    const selectedItem = items.find((item) => item.id === itemId);

    setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((row, rowIndex) => rowIndex === index ? updateSelectedItem(row, selectedItem) : row) }));
  };
  /**
   *
   * @param index
   * @param field
   * @param value
   */
  const onItemChange = (index: number, field: keyof OrderItemPayload, value: string | number): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => itemIndex === index ? updateItem(item, field, value) : item) }));

  /**
   *
   * @param itemId
   */
  const onToggleItem = (itemId: string): void => setForm((previous) => toggleItem(previous, itemId, items));
  /**
   *
   * @param projectId
   */
  const onToggleProject = (projectId: string): void => setForm((previous) => toggleProject(previous, projectId, projects));

  return { onToggleItem, onToggleProject, onCustomerChange, onPicChange, onVoucherChange, onServiceTypeChange, onOrderTypeChange, onHandoverTypeChange, onProjectSelect, onItemSelect, onChange, onItemChange, onAddItem, onRemoveItem };
};

/**
 * Update selected item row. @param {OrderItemPayload} row - current row. @param {OrderItemOption | undefined} selectedItem - selected item. @returns {OrderItemPayload} updated row.
 * @param row
 * @param selectedItem
 */
const updateSelectedItem = (row: OrderItemPayload, selectedItem: OrderItemOption | undefined): OrderItemPayload => {
  if (!selectedItem) return EMPTY_ITEM;

  const price = selectedItem.price ?? 0;

  return { ...row, item_id: selectedItem.id, item_name: selectedItem.name, price, subtotal: price * row.qty };
};

/**
 * Update item field and subtotal. @param {OrderItemPayload} item - current item. @param {keyof OrderItemPayload} field - field name. @param {string | number} value - field value. @returns {OrderItemPayload} updated item.
 * @param item
 * @param field
 * @param value
 */
const updateItem = (item: OrderItemPayload, field: keyof OrderItemPayload, value: string | number): OrderItemPayload => {
  const updatedItem = { ...item, [field]: value };

  return { ...updatedItem, subtotal: updatedItem.price * updatedItem.qty };
};

/**
 * Toggle item selection. @param {OrderCreateFormState} form - current form. @param {string} itemId - item ID. @param {OrderItemOption[]} items - item options. @returns {OrderCreateFormState} updated form.
 * @param form
 * @param itemId
 * @param items
 */
const toggleItem = (form: OrderCreateFormState, itemId: string, items: OrderItemOption[]): OrderCreateFormState => {
  const selectedIndex = form.rental_transaction_items.findIndex((item) => item.item_id === itemId);

  if (selectedIndex >= 0) return { ...form, rental_transaction_items: form.rental_transaction_items.filter((_item, index) => index !== selectedIndex) };

  const emptyIndex = form.rental_transaction_items.findIndex((item) => !item.item_id);

  if (emptyIndex >= 0) return replaceItem(form, emptyIndex, itemId, items);

  const selectedItem = items.find((item) => item.id === itemId);

  return selectedItem ? { ...form, rental_transaction_items: [...form.rental_transaction_items, updateSelectedItem(EMPTY_ITEM, selectedItem)] } : form;
};

/**
 * Replace empty item row. @param {OrderCreateFormState} form - current form. @param {number} index - row index. @param {string} itemId - item ID. @param {OrderItemOption[]} items - item options. @returns {OrderCreateFormState} updated form.
 * @param form
 * @param index
 * @param itemId
 * @param items
 */
const replaceItem = (form: OrderCreateFormState, index: number, itemId: string, items: OrderItemOption[]): OrderCreateFormState => ({ ...form, rental_transaction_items: form.rental_transaction_items.map((item, itemIndex) => itemIndex === index ? updateSelectedItem(item, items.find((option) => option.id === itemId)) : item) });

/**
 * Toggle project selection. @param {OrderCreateFormState} form - current form. @param {string} projectId - project ID. @param {ProjectData[]} projects - project options. @param {OrderItemOption[]} items - item options. @returns {OrderCreateFormState} updated form.
 * @param form
 * @param projectId
 * @param projects
 * @param items
 */
const toggleProject = (form: OrderCreateFormState, projectId: string, projects: ProjectData[]): OrderCreateFormState => {
  if (form.rental_transaction_items.some((item) => item.project_id === projectId)) return { ...form, rental_transaction_items: form.rental_transaction_items.filter((item) => item.project_id !== projectId) };

  const project = projects.find((option) => option.id === projectId);
  if (!project) return form;
  const projectItems = project.items.map((item) => ({ ...EMPTY_ITEM, item_id: item.item_id, project_id: project.id, item_name: item.item_name ?? "", qty: item.qty, price: 0, subtotal: 0 }));
  const projectHeader = { ...EMPTY_ITEM, item_id: project.id, project_id: project.id, item_name: project.name, qty: 1, price: project.price, subtotal: project.price };

  return { ...form, rental_transaction_items: [...form.rental_transaction_items, projectHeader, ...projectItems] };
};

/**
 * Build order payload. @param {OrderCreateFormState} form - current form. @param {OrderItemPayload[]} items - selected items. @returns {OrderCreatePayload} order payload.
 * @param form
 * @param items
 */
const buildOrderPayload = (form: OrderCreateFormState, items: OrderItemPayload[], orderTypes: OrderType[]): OrderCreatePayload => {
  const totals = calculateOrderTotals(items, form.discount, form.service_fee, form.start_at, form.end_at);
  const selectedOrderType = orderTypes.find((orderType) => orderType.id === form.order_type_id);
  const rentalHandover: RentalHandoverPayload | undefined = selectedOrderType?.is_handover
    ? {
        order_type_id: selectedOrderType.id,
        type: form.handover_type,
        name: form.handover_name,
        status: 1,
      }
    : undefined;

  return { customer_id: form.customer_id, pic_id: form.pic_id, voucher_id: form.voucher_id, service_type_id: form.service_type_id, order_type_id: form.order_type_id, customer_name: form.customer_name, customer_phone: form.customer_phone, address: form.address, event_name: form.event_name, start_at: formatOrderDate(form.start_at), end_at: formatOrderDate(form.end_at), subtotal: totals.subtotal, discount: form.discount, service_fee: form.service_fee, remarks: form.remarks, grand_total: totals.grandTotal, status: 1, rental_transaction_items: items, ...(rentalHandover ? { rental_handover: rentalHandover } : {}) };
};

/** Manage order creation form state, validation, and submission. @returns {OrderCreateState} order creation state and handlers. */
export const useOrderCreateForm = (): OrderCreateState => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as OrderLocationState | null)?.returnUrl;
  const { id } = useParams();
  const [form, setForm] = useState<OrderCreateFormState>(INITIAL_FORM);
  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInformationErrors, setShowInformationErrors] = useState<boolean>(false);
  const [showItemErrors, setShowItemErrors] = useState<boolean>(false);
  const customerQuery = useGetAllCustomersQuery();
  const picQuery = useGetAllPicsQuery();
  const serviceTypeQuery = useGetAllServiceTypesQuery();
  const orderTypeQuery = useGetAllOrderTypesQuery();
  const itemQuery = useGetAllItemsQuery();
  const projectQuery = useGetAllProjectsQuery();
  const voucherQuery = useGetAllVouchersQuery();
  const orderDetailQuery = useGetOrderByIdQuery(id ?? "", { skip: !id });
  const hasInitializedEdit = useRef(false);

  useEffect(() => {
    if (!id || hasInitializedEdit.current || !orderDetailQuery.data?.data) return;

    setForm(buildEditForm(orderDetailQuery.data.data));
    hasInitializedEdit.current = true;
  }, [id, orderDetailQuery.data]);

  const [createOrder, createMutation] = useCreateOrderMutation();
  const [createProjectOrder] = useCreateProjectOrderMutation();
  const [updateOrder, updateMutation] = useUpdateOrderMutation();
  const [createActivityLog] = useCreateActivityLogMutation();
  const mutation = id ? updateMutation : createMutation; // Edit quotation transaction when route carries transaction_id.
  const customers = customerQuery.data?.data ?? [];
  const pics = picQuery.data?.data ?? [];
  const serviceTypes = serviceTypeQuery.data?.data ?? [];
  const orderTypes = orderTypeQuery.data?.data ?? [];
  const [voucherSearchInput, setVoucherSearchInput] = useState("");
  const [voucherSearchCode, setVoucherSearchCode] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVoucherSearchCode(voucherSearchInput.trim());
    }, 500);

    return (): void => window.clearTimeout(timer);
  }, [voucherSearchInput]);

  const { data: searchedVoucher } = useGetVoucherByCodeQuery(voucherSearchCode, { skip: !voucherSearchCode });
  const voucherSearchResult = searchedVoucher?.data;
  const voucherData = Array.isArray(voucherSearchResult) ? voucherSearchResult[0] : voucherSearchResult;

  const vouchers = (voucherSearchInput.trim() && voucherData)
    ? [{ id: voucherData.id, name: voucherData.name, discount_percent: voucherData.discount_percent }]
    : (voucherQuery.data?.data ?? []);

  const items = itemQuery.data?.data ?? [];
  const projects = (projectQuery.data?.data ?? []).map((project) => ({ id: project.id, name: project.name, price: project.price, items: project.items ?? [] }));
  const actions = createFormActions(setForm, customers, vouchers, serviceTypes, items, projects);

  const onVoucherSearch = (code: string): void => {
    setVoucherSearchInput(code);

    if (!code.trim()) {
      setVoucherSearchCode("");
      void voucherQuery.refetch();
    }
  };
  const actionsWithSearch = { ...actions, onVoucherSearch };
  /**
   *
   */
  const onBack = (): void => { void navigate(-1); };
  /**
   *
   */
  const onNextStep = (): void => {
    const isHandover = Boolean(orderTypes.find((orderType) => orderType.id === form.order_type_id)?.is_handover);

    if (step === 1 && !isOrderInformationValid(form, isHandover)) { setShowInformationErrors(true); setErrorMessage("Please complete all required Order Information fields.");

 return; }

    if (step === 2 && !hasSelectedOrderItem(form.rental_transaction_items)) { setShowItemErrors(true); setErrorMessage("Please select at least one item.");

 return; }

    setShowInformationErrors(false); setShowItemErrors(false); setErrorMessage(null); setStep(getNextOrderStep);
  };
  /**
   *
   */
  const onPreviousStep = (): void => setStep(getPreviousOrderStep);
  /**
   *
   * @param event
   */
  const onPreventSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => event.preventDefault();
  /**
   *
   * @param event
   */
  const onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await submitOrder(
        form,
        orderTypes,
        projects,
        id,
        createOrder,
        createProjectOrder,
        updateOrder,
        createActivityLog,
        navigate,
        setErrorMessage,
        returnUrl,
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? `Unable to save order: ${error.message}` : "Unable to save order. Please review the form and try again.");
    }
  };

  return { form, customers, pics, serviceTypes, orderTypes, vouchers, projects, items, isCustomersLoading: customerQuery.isLoading, isPicsLoading: picQuery.isLoading, isServiceTypesLoading: serviceTypeQuery.isLoading, isOrderTypesLoading: orderTypeQuery.isLoading, isVouchersLoading: voucherQuery.isLoading, isProjectsLoading: projectQuery.isLoading, isItemsLoading: itemQuery.isLoading, isEdit: Boolean(id), isSubmitting: mutation.isLoading, errorMessage, showInformationErrors, showItemErrors, step, onBack, onNextStep, onPreviousStep, ...actionsWithSearch, onSubmit, onPreventSubmit };
};

/**
 * Route after successful order submission.
 * @param {NavigateFunction} navigate - route navigation
 * @param {string | undefined} id - transaction ID
 * @param {string | undefined} returnUrl - return route
 * @returns {void}
 */
const _resolveSubmitRoute = (
  navigate: NavigateFunction,
  id: string | undefined,
  returnUrl: string | undefined,
): void => {
  if (returnUrl) {
    navigate(returnUrl);

    return;
  }

  if (id) {
    navigate(-1);

    return;
  }

  navigate("/document/quotation");
};

/**
 * Submit order payload. @param {OrderCreateFormState} form - current form. @param {Function} createOrder - standard order mutation. @param {Function} createProjectOrder - project order mutation. @param {Function} navigate - route navigation. @param {React.Dispatch<React.SetStateAction<string | null>>} setErrorMessage - error setter. @returns {Promise<void>} completion promise.
 * @param form
 * @param createOrder
 * @param createProjectOrder
 * @param navigate
 * @param setErrorMessage
 */
const submitOrder = async (
  form: OrderCreateFormState,
  orderTypes: OrderType[],
  projects: ProjectData[],
  id: string | undefined,
  createOrder: (payload: OrderCreatePayload) => { unwrap: () => Promise<unknown> },
  createProjectOrder: (payload: ProjectOrderCreatePayload) => { unwrap: () => Promise<unknown> },
  updateOrder: (request: { id: string; payload: OrderCreatePayload }) => { unwrap: () => Promise<unknown> },
  createActivityLog: (payload: { user_name: string; action: "create" | "edit" | "delete" | "view"; page: string; description: string }) => { unwrap: () => Promise<unknown> },
  navigate: NavigateFunction,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  returnUrl?: string,
): Promise<void> => {
  const items = form.rental_transaction_items.filter((item) => item.item_id);
  const payloadItems = form.service_type_name.trim().toUpperCase() === "PROJECT"
    ? items.filter((item) => item.item_id === item.project_id)
    : items;
  const payload = buildOrderPayload(form, payloadItems, orderTypes);

  if (id) {
    await updateOrder({ id, payload: { ...payload, status: form.status } }).unwrap();
  } else if (form.service_type_name.trim().toUpperCase() === "PROJECT") {
    const projectItems = buildProjectItems(items, projects, form.start_at, form.end_at);

    if (!projectItems.length) {
      setErrorMessage("Please select at least one project with items.");

      return;
    }

    await createProjectOrder({ ...payload, rental_transaction_items: projectItems }).unwrap();
  } else {
    await createOrder(payload).unwrap();
  }

  const userName = getUsername();
  if (userName) {
    try {
      await createActivityLog({
        user_name: userName,
        action: id ? "edit" : "create",
        page: "Order",
        description: `Order ${id || payload.event_name} has been ${id ? "updated" : "created"}.`,
      }).unwrap();
    } catch {
      // Activity log failure should not block user workflow
    }
  }

  _resolveSubmitRoute(navigate, id, returnUrl);
};
