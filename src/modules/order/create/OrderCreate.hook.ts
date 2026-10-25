import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetAllCustomersQuery } from "@/services/master-customer.service";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useGetAllPicsQuery } from "@/services/master-pic.service";
import { useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetAllVouchersQuery } from "@/services/master-voucher.service";
import { useGetAllServiceTypesQuery } from "@/services/master-service-type.service";
import { useCreateOrderMutation, useCreateProjectOrderMutation } from "@/services/order.service";

import type { OrderItemPayload } from "../Order.type";

import { calculateOrderTotals, getNextOrderStep, getPreviousOrderStep, hasSelectedOrderItem, isOrderInformationValid } from "./OrderCreate.helpers";
import type { OrderCreateFormState, OrderCreateState } from "./OrderCreate.type";

const EMPTY_ITEM: OrderItemPayload = { item_id: "", project_id: null, item_name: "", qty: 1, price: 0, subtotal: 0, remark: "" };
const INITIAL_FORM: OrderCreateFormState = { customer_id: "", pic_id: "", voucher_id: "", service_type_id: "", service_type_name: "", customer_name: "", customer_phone: "", address: "", event_name: "", start_at: "", end_at: "", subtotal: 0, discount: 0, service_fee: 0, remarks: "", grand_total: 0, status: 1, rental_transaction_items: [EMPTY_ITEM] };
const formatOrderDate = (value: string): string => {
  const date = new Date(value);
  const pad = (part: number): string => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const useOrderCreateLogic = (): OrderCreateState => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<OrderCreateFormState>(INITIAL_FORM);
  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInformationErrors, setShowInformationErrors] = useState<boolean>(false);
  const [showItemErrors, setShowItemErrors] = useState<boolean>(false);
  const customerQuery = useGetAllCustomersQuery();
  const picQuery = useGetAllPicsQuery();
  const serviceTypeQuery = useGetAllServiceTypesQuery();
  const itemQuery = useGetAllItemsQuery();
  const projectQuery = useGetAllProjectsQuery();
  const voucherQuery = useGetAllVouchersQuery();
  const [createOrder, mutation] = useCreateOrderMutation();
  const [createProjectOrder, projectMutation] = useCreateProjectOrderMutation();

  const onBack = (): void => { void navigate(-1); };
  const onNextStep = (): void => {
    if (step === 1 && !isOrderInformationValid(form)) {
      setShowInformationErrors(true);
      setErrorMessage("Please complete all required Order Information fields.");
      return;
    }

    if (step === 2 && !hasSelectedOrderItem(form.rental_transaction_items)) {
      setShowItemErrors(true);
      setErrorMessage("Please select at least one item.");
      return;
    }

    setShowInformationErrors(false);
    setShowItemErrors(false);
    setErrorMessage(null);
    setStep(getNextOrderStep);
  };
  const onPreviousStep = (): void => setStep(getPreviousOrderStep);
  const onCustomerChange = (customerId: string): void => {
    const customer = customerQuery.data?.data.find((item) => item.id === customerId);

    if (customer) setForm((previous) => ({ ...previous, customer_id: customer.id, customer_name: customer.name, customer_phone: customer.phone_number, address: customer.address }));
  };
  const onChange = (field: keyof OrderCreateFormState, value: string | number): void => setForm((previous) => ({ ...previous, [field]: value }));
  const onPicChange = (picId: string): void => onChange("pic_id", picId);
  const onVoucherChange = (voucherId: string): void => {
    const voucher = voucherQuery.data?.data.find((item) => item.id === voucherId);
    setForm((previous) => ({ ...previous, voucher_id: voucherId, discount: voucher?.discount_percent ?? 0 }));
  };
  const onServiceTypeChange = (serviceTypeId: string): void => {
    const serviceType = serviceTypeQuery.data?.data.find((item) => item.id === serviceTypeId);
    const serviceTypeName = serviceType?.name ?? "";

    setForm((previous) => ({ ...previous, service_type_id: serviceTypeId, service_type_name: serviceTypeName, rental_transaction_items: serviceTypeName.trim().toUpperCase() === "PROJECT" ? [] : previous.rental_transaction_items.map((item) => ({ ...item, project_id: null })) }));
  };
  const onToggleItem = (itemId: string): void => {
    const selectedIndex = form.rental_transaction_items.findIndex((item) => item.item_id === itemId);
    if (selectedIndex >= 0) { onRemoveItem(selectedIndex); return; }
    const emptyIndex = form.rental_transaction_items.findIndex((item) => !item.item_id);
    if (emptyIndex >= 0) { onItemSelect(emptyIndex, itemId); return; }
    const item = itemQuery.data?.data.find((option) => option.id === itemId);
    if (item) setForm((previous) => ({ ...previous, rental_transaction_items: [...previous.rental_transaction_items, { ...EMPTY_ITEM, item_id: item.id, item_name: item.name, price: item.price ?? 0, subtotal: item.price ?? 0 }] }));
  };
  const onToggleProject = (projectId: string): void => {
    const isSelected = form.rental_transaction_items.some((item) => item.project_id === projectId);

    if (isSelected) {
      setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.filter((item) => item.project_id !== projectId) }));
      return;
    }

    const project = projectQuery.data?.data.find((item) => item.id === projectId);

    if (!project) return;

    setForm((previous) => ({ ...previous, rental_transaction_items: [...previous.rental_transaction_items, { ...EMPTY_ITEM, item_id: project.id, project_id: project.id, item_name: project.name, qty: 1 }] }));
  };
  const onProjectSelect = (index: number, projectId: string): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => itemIndex === index ? { ...item, project_id: projectId } : item) }));
  const onItemSelect = (index: number, itemId: string): void => {
    const item = itemQuery.data?.data.find((option) => option.id === itemId);
    setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((row, rowIndex) => rowIndex === index ? item ? { ...row, item_id: item.id, item_name: item.name, price: item.price ?? 0, subtotal: (item.price ?? 0) * row.qty } : EMPTY_ITEM : row) }));
  };
  const onItemChange = (index: number, field: keyof OrderItemPayload, value: string | number): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.map((item, itemIndex) => {
    if (itemIndex !== index) return item;
    const updatedItem = { ...item, [field]: value };

    return { ...updatedItem, subtotal: updatedItem.price * updatedItem.qty };
  }) }));
  const onAddItem = (): void => setForm((previous) => ({ ...previous, rental_transaction_items: [...previous.rental_transaction_items, EMPTY_ITEM] }));
  const onRemoveItem = (index: number): void => setForm((previous) => ({ ...previous, rental_transaction_items: previous.rental_transaction_items.filter((_item, itemIndex) => itemIndex !== index) }));
  const onPreventSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => event.preventDefault();
  const onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const totals = calculateOrderTotals(form.rental_transaction_items.filter((item) => item.item_id), form.discount, form.service_fee);
      const payload = {
        customer_id: form.customer_id,
        pic_id: form.pic_id,
        voucher_id: form.voucher_id,
        service_type_id: form.service_type_id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        address: form.address,
        event_name: form.event_name,
        start_at: formatOrderDate(form.start_at),
        end_at: formatOrderDate(form.end_at),
        subtotal: totals.subtotal,
        discount: form.discount,
        service_fee: form.service_fee,
        remarks: form.remarks,
        grand_total: totals.grandTotal,
        status: 1,
        rental_transaction_items: form.rental_transaction_items.filter((item) => item.item_id),
      };

      if (form.service_type_name.trim().toUpperCase() === "PROJECT") {
        const projectItems = payload.rental_transaction_items.map((item) => ({
          project_id: item.project_id ?? "",
          qty: item.qty,
          price: item.price,
          subtotal: item.subtotal,
          remark: item.remark,
        }));

        await createProjectOrder({ ...payload, rental_transaction_items: projectItems }).unwrap();
      } else {
        await createOrder(payload).unwrap();
      }

      navigate("/order");
    } catch {
      setErrorMessage("Unable to save order. Please review the form and try again.");
    }
  };

  return { form, customers: customerQuery.data?.data ?? [], pics: picQuery.data?.data ?? [], serviceTypes: serviceTypeQuery.data?.data ?? [], vouchers: voucherQuery.data?.data ?? [], projects: (projectQuery.data?.data ?? []).map((project) => ({ id: project.id, name: project.name, items: project.items ?? [] })), items: itemQuery.data?.data ?? [], onToggleItem, onToggleProject, isCustomersLoading: customerQuery.isLoading, isPicsLoading: picQuery.isLoading, isServiceTypesLoading: serviceTypeQuery.isLoading, isVouchersLoading: voucherQuery.isLoading, isProjectsLoading: projectQuery.isLoading, isItemsLoading: itemQuery.isLoading, isEdit: Boolean(id), isSubmitting: mutation.isLoading, errorMessage, showInformationErrors, showItemErrors, step, onBack, onNextStep, onPreviousStep, onCustomerChange, onPicChange, onVoucherChange, onServiceTypeChange, onProjectSelect, onItemSelect, onChange, onItemChange, onAddItem, onRemoveItem, onSubmit, onPreventSubmit };
};
