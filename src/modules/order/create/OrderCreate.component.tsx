import * as React from "react";

import { DateRangePicker } from "@/components/DateRangePicker";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";

import Layout from "@/app/layout";

import { calculateOrderTotals } from "./OrderCreate.helpers";
import type {
  OrderCreateFormState,
  OrderCreateProps,
} from "./OrderCreate.type";
import type { OrderItemPayload } from "../Order.type";

const RUPIAH_FORMATTER = new Intl.NumberFormat("id-ID");

/**
 * Format date for review display without T separator.
 * @param {string} [value] - ISO date string.
 * @returns {string} Formatted date.
 */
const _formatReviewDate = (value?: string): string =>
  value ? value.replace("T", " ") : "-";

/**
 * Render _renderSelect.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-customer"
    label="Customer"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5"
    selectClassName="!h-16 [&_.ant-select-selector]:!min-h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    required
    errorMessage={
      props.showInformationErrors && !props.form.customer_id.trim()
        ? "Customer is required"
        : undefined
    }
    value={props.form.customer_id}
    onChange={props.onCustomerChange}
    disabled={props.isCustomersLoading}
    placeholder={
      props.isCustomersLoading ? "Loading customers…" : "Select customer"
    }
    options={props.customers.map((customer) => ({
      value: customer.id,
      label: `${customer.name} — ${customer.phone_number}`,
    }))}
  />
);

/**
 * Render _renderPicSelect.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderPicSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-pic"
    label="PIC"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5 [&_.ant-select-selector]:!min-h-16"
    selectClassName="!h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    required
    errorMessage={
      props.showInformationErrors && !props.form.pic_id.trim()
        ? "PIC is required"
        : undefined
    }
    value={props.form.pic_id}
    onChange={props.onPicChange}
    disabled={props.isPicsLoading}
    placeholder={props.isPicsLoading ? "Loading PIC…" : "Select PIC"}
    options={props.pics.map((pic) => ({ value: pic.id, label: pic.name }))}
  />
);

/**
 * Render order type select.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderOrderTypeSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-order-type"
    label="Order Type"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5 [&_.ant-select-selector]:!min-h-16"
    selectClassName="!h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    required
    errorMessage={props.showInformationErrors && !props.form.order_type_id.trim() ? "Order Type is required" : undefined}
    value={props.form.order_type_id}
    onChange={props.onOrderTypeChange}
    disabled={props.isOrderTypesLoading}
    placeholder={props.isOrderTypesLoading ? "Loading order types…" : "Select order type"}
    options={props.orderTypes.map((orderType) => ({ value: orderType.id, label: orderType.name }))}
  />
);

/**
 * Render identity type select.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderHandoverTypeSelect = (
  props: OrderCreateProps,
): React.ReactElement => (
  <Select
    id="order-handover-type"
    label="Identity Type"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5 [&_.ant-select-selector]:!min-h-16"
    selectClassName="!h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    required
    errorMessage={props.showInformationErrors && !props.form.handover_type.trim() ? "Identity Type is required" : undefined}
    value={props.form.handover_type}
    onChange={props.onHandoverTypeChange}
    placeholder="Select identity type"
    options={[
      { value: "KTP", label: "KTP" },
      { value: "SIM", label: "SIM" },
      { value: "ID CARD", label: "ID CARD" },
    ]}
  />
);

/**
 * Render service type select.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderServiceTypeSelect = (
  props: OrderCreateProps,
): React.ReactElement => (
  <Select
    id="order-service-type"
    label="Service Type"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5 [&_.ant-select-selector]:!min-h-16"
    selectClassName="!h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    required
    errorMessage={
      props.showInformationErrors && !props.form.service_type_id.trim()
        ? "Service Type is required"
        : undefined
    }
    value={props.form.service_type_id}
    onChange={props.onServiceTypeChange}
    disabled={props.isServiceTypesLoading}
    placeholder={
      props.isServiceTypesLoading
        ? "Loading service types…"
        : "Select service type"
    }
    options={props.serviceTypes.map((serviceType) => ({
      value: serviceType.id,
      label: serviceType.name,
    }))}
  />
);

/**
 * Render _renderVoucherSelect.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderVoucherSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-voucher"
    label="Voucher"
    labelClassName="!text-lg !font-semibold !normal-case !text-text-primary"
    className="mb-5 [&_.ant-select-selector]:!min-h-16"
    selectClassName="!h-16 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selection-item]:!text-2xl [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-placeholder]:!text-2xl"
    value={props.form.voucher_id}
    onChange={props.onVoucherChange}
    disabled={props.isVouchersLoading}
    placeholder={
      props.isVouchersLoading ? "Loading vouchers…" : "Select voucher"
    }
    options={props.vouchers.map((voucher) => ({
      value: voucher.id,
      label: voucher.name,
    }))}
  />
);

/**
 * Render _renderDateRange.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderDateRange = (props: OrderCreateProps): React.ReactElement => {
  /**
   * Handle date change.
   * @param {string} value - Date value.
   * @returns {void} Nothing.
   */
  const handleStartDateChange = (value: string): void =>
    props.onChange("start_at", value);
  /**
   * Handle date change.
   * @param {string} value - Date value.
   * @returns {void} Nothing.
   */
  const handleEndDateChange = (value: string): void =>
    props.onChange("end_at", value);

  return (
    <DateRangePicker
      className="mb-5 md:col-span-2 [&>div]:gap-5 [&_.ant-picker]:!h-16 [&_.ant-picker]:!rounded-2xl [&_.ant-picker-input>input]:!text-xl [&_.ant-picker-input>input]:!font-normal [&_label]:!text-lg [&_label]:!font-semibold [&_label]:!normal-case [&_label]:!text-text-primary"
      startLabel="Start Date *"
      endLabel="End Date *"
      startDate={props.form.start_at}
      endDate={props.form.end_at}
      startError={props.showInformationErrors && !props.form.start_at.trim()}
      endError={props.showInformationErrors && !props.form.end_at.trim()}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      showTime
    />
  );
};

const _renderField = (
  props: OrderCreateProps,
  config: {
    field: keyof OrderCreateFormState;
    label: string;
    placeholder: string;
    type?: "text" | "tel";
  },
): React.ReactElement => {
  /**
   * Handle input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    props.onChange(config.field, event.target.value);
  const value = String(props.form[config.field]);
  const isInvalid = props.showInformationErrors && !value.trim();

  return (
    <InputComponent
      id={`order-${config.field}`}
      label={config.label}
      placeholder={config.placeholder}
      required
      value={value}
      onChange={handleChange}
      type={config.type ?? "text"}
      className="mb-5 [&_.ant-input]:!h-16 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg [&_label]:!font-semibold [&_label]:!normal-case [&_label]:!text-text-primary"
      errorMessage={isInvalid ? `${config.label} is required` : undefined}
    />
  );
};

/**
 * Render _renderServiceFee.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderServiceFee = (props: OrderCreateProps): React.ReactElement => {
  /**
   * Handle input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    props.onChange(
      "service_fee",
      Number(event.target.value.replace(/\D/g, "")),
    );
  const formattedValue =
    props.form.service_fee > 0
      ? `Rp ${RUPIAH_FORMATTER.format(props.form.service_fee)}`
      : "";

  return (
    <InputComponent
      id="order-service-fee"
      label="Service Fee"
      placeholder="Enter service fee"
      value={formattedValue}
      onChange={handleChange}
      inputMode="numeric"
      className="mb-5 [&_.ant-input]:!h-16 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg [&_label]:!font-semibold [&_label]:!normal-case [&_label]:!text-text-primary"
    />
  );
};

/**
 * Render project card with included items.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderCreateProps["projects"][number]} project - Project option.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderProjectCard = (
  props: OrderCreateProps,
  project: OrderCreateProps["projects"][number],
): React.ReactElement => {
  const isSelected = props.form.rental_transaction_items.some(
    (item) => item.project_id === project.id,
  );
  const hasError = props.showItemErrors && !isSelected;
  let cardClass = "border-border-default bg-background-surface";

  if (isSelected) {
    cardClass = "border-action-primary bg-action-primary-subtle/20 shadow-xs";
  } else if (hasError) {
    cardClass = "border-danger bg-background-surface";
  }

  const projectPriceTotal = project.items.reduce((accumulator, item) => {
    const itemDetail = props.items.find((option) => option.id === item.item_id);

    return accumulator + (itemDetail?.price ?? 0) * item.qty;
  }, 0);

  /**
   * Handle toggling project selection.
   * @returns {void} No return value.
   */
  const handleToggle = (): void => props.onToggleProject(project.id);

  return (
    <div
      key={project.id}
      className={`flex flex-col overflow-hidden rounded-2xl border transition-colors ${cardClass}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isSelected}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-background-subtle/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-action-primary-subtle text-action-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <strong className="truncate text-base font-bold text-text-primary">
                {project.name}
              </strong>
              <span className="shrink-0 rounded-full bg-action-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-action-primary">
                {project.items.length} items
              </span>
            </div>
            {projectPriceTotal > 0 && (
              <p className="mt-0.5 text-xs font-medium text-text-secondary">
                Total: Rp {projectPriceTotal.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${isSelected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default bg-background-surface text-transparent"}`}
        >
          ✓
        </span>
      </button>

      <div className="border-t border-border-default/70 bg-background-subtle/30 p-4">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
          Items Included
        </p>
        {project.items.length === 0 ? (
          <p className="text-xs italic text-text-tertiary">No items in this project</p>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {project.items.map((item) => {
              const itemDetail = props.items.find((option) => option.id === item.item_id);
              const itemName = item.item_name ?? itemDetail?.name ?? item.item_id;
              const price = itemDetail?.price ?? 0;
              const subtotal = price * item.qty;

              return (
                <div
                  key={`${project.id}-${item.item_id}`}
                  className="flex items-center gap-3 rounded-xl border border-border-default/80 bg-background-surface p-2.5 shadow-2xs"
                >
                  {itemDetail?.image ? (
                    <img
                      src={itemDetail.image}
                      alt={itemName}
                      className="h-11 w-11 shrink-0 rounded-lg border border-border-default/50 object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-text-tertiary">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {itemName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="rounded bg-action-primary-subtle px-1.5 py-0.5 font-semibold text-action-primary">
                        Qty: {item.qty}
                      </span>
                      {price > 0 && (
                        <span className="font-medium text-text-secondary">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Render _renderItemCard.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderCreateProps["items"][number]} option - Render option.
 * @param {OrderItemPayload} item - Render item.
 * @param {number} index - Item index.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderItemCard = (
  props: OrderCreateProps,
  option: OrderCreateProps["items"][number],
): React.ReactElement => {
  const selected = props.form.rental_transaction_items.find(
    (item) => item.item_id === option.id,
  );
  const hasError = props.showItemErrors && !selected;
  let itemCardClass = "border-border-default bg-background-surface";

  if (selected)
    itemCardClass = "border-action-primary bg-action-primary-subtle";
  if (hasError) itemCardClass = "border-danger bg-background-surface";

  return (
    <div
      className={`relative min-h-32 rounded-2xl border p-4 transition-colors md:h-32 md:overflow-hidden ${itemCardClass}`}
    >
      <button
        type="button"
        onClick={() => props.onToggleItem(option.id)}
        aria-label={`Select ${option.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
      />
      <div className="pointer-events-none relative z-10 flex min-w-0 items-start gap-3">
        {option.image ? (
          <img
            src={option.image}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs text-text-tertiary">
            No image
          </div>
        )}
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-sm font-semibold text-text-primary">
            {option.name}
          </strong>
          <small className="mt-1 block truncate text-text-secondary">
            Stock: {option.stock ?? 0} · Rp{" "}
            {(option.price ?? 0).toLocaleString("id-ID")}
          </small>
        </span>
        {selected && (
          <div className="pointer-events-auto hidden shrink-0 items-center gap-3 md:flex">
            <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
              Qty
              <input
                id={`order-qty-${option.id}`}
                type="number"
                min="1"
                max={option.stock ?? undefined}
                value={selected.qty}
                onChange={(event) =>
                  props.onItemChange(
                    props.form.rental_transaction_items.indexOf(selected),
                    "qty",
                    Number(event.target.value),
                  )
                }
                className="h-10 w-16 rounded-lg border border-border-default bg-background-surface px-2 text-center text-sm text-text-primary"
              />
            </label>
            <label className="flex w-40 flex-col gap-1 text-xs font-medium text-text-secondary">
              Remark
              <input
                id={`order-remark-${option.id}`}
                value={selected.remark}
                onChange={(event) =>
                  props.onItemChange(
                    props.form.rental_transaction_items.indexOf(selected),
                    "remark",
                    event.target.value,
                  )
                }
                placeholder="Optional note"
                className="h-10 w-full rounded-lg border border-border-default bg-background-surface px-3 text-sm text-text-primary placeholder:text-text-tertiary"
              />
            </label>
          </div>
        )}
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm ${selected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}
        >
          ✓
        </span>
      </div>
    </div>
  );
};

/* Item details are rendered inline in each Master Project-style card. */
/**
 * Render _renderItem.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderCreateProps["items"][number]} option - Render option.
 * @param {OrderItemPayload} item - Render item.
 * @param {number} index - Item index.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderItem = (
  props: OrderCreateProps,
  item: OrderItemPayload,
  index: number,
): React.ReactElement => {
  const handleText =
    (field: keyof OrderItemPayload) =>
    (event: React.ChangeEvent<HTMLInputElement>): void =>
      props.onItemChange(index, field, event.target.value);
  const handleNumber =
    (field: keyof OrderItemPayload) =>
    (event: React.ChangeEvent<HTMLInputElement>): void =>
      props.onItemChange(index, field, Number(event.target.value));
  /**
   * Handle input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleRemove = (): void => props.onRemoveItem(index);

  return (
    <div
      key={`${index}-${item.item_id}`}
      className={`relative space-y-4 rounded-2xl border p-4 transition-colors ${item.item_id ? "border-action-primary bg-action-primary-subtle" : "border-border-default bg-background-surface"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${item.item_id ? "bg-action-primary text-text-inverse" : "bg-background-subtle text-text-tertiary"}`}
          >
            {index + 1}
          </span>
          <div>
            <h3 className="font-semibold text-text-primary">
              {item.item_name || "Select item"}
            </h3>
            <p className="mt-0.5 text-xs text-text-secondary">
              Set item, project, quantity, and price.
            </p>
          </div>
        </div>
        {props.form.rental_transaction_items.length > 1 && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-semibold text-danger"
          >
            Remove
          </button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          id={`order-item-${index}`}
          label="Item"
          required
          value={item.item_id}
          onChange={(value) => props.onItemSelect(index, value)}
          disabled={props.isItemsLoading}
          placeholder={props.isItemsLoading ? "Loading items…" : "Select item"}
          options={props.items.map((option) => ({
            value: option.id,
            label: option.name,
          }))}
        />
        <Select
          id={`order-project-${index}`}
          label="Project"
          required
          value={item.project_id ?? ""}
          onChange={(value) => props.onProjectSelect(index, value)}
          disabled={props.isProjectsLoading}
          placeholder={
            props.isProjectsLoading ? "Loading projects…" : "Select project"
          }
          options={props.projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))}
        />
        <input
          required
          value={item.item_name}
          onChange={handleText("item_name")}
          placeholder="Item name"
          className="rounded-xl border border-border-default bg-background-surface px-4 py-3"
        />
        <input
          required
          min={1}
          value={item.qty}
          onChange={handleNumber("qty")}
          type="number"
          placeholder="Qty"
          className="rounded-xl border border-border-default bg-background-surface px-4 py-3"
        />
        <input
          required
          min={0}
          value={item.price}
          onChange={handleNumber("price")}
          type="number"
          placeholder="Price"
          className="rounded-xl border border-border-default bg-background-surface px-4 py-3"
        />
        <input
          required
          min={0}
          value={item.subtotal}
          onChange={handleNumber("subtotal")}
          type="number"
          placeholder="Subtotal"
          className="rounded-xl border border-border-default bg-background-surface px-4 py-3"
        />
        <input
          value={item.remark}
          onChange={handleText("remark")}
          placeholder="Remark"
          className="rounded-xl border border-border-default bg-background-surface px-4 py-3 md:col-span-2"
        />
      </div>
    </div>
  );
};

/**
 * Resolve step text color.
 * @param {number} index - Step index
 * @param {number} step - Current step
 * @param {boolean} hasError - Step validation state
 * @returns {string} Text class
 */
const _getStepTabClass = (
  index: number,
  step: number,
  hasError: boolean,
): string => {
  if (hasError) return "text-danger";
  if (step === index + 1) return "font-semibold text-text-primary";

  return "font-normal text-text-secondary";
};

const _getStepUnderlineClass = (index: number, step: number): string =>
  step === index + 1 ? "bg-action-primary" : "bg-transparent";


const _renderMobileBack = (
  isEdit: boolean,
  onBack: () => void,
): React.ReactElement => (
  <div className="flex items-center gap-3 bg-background-surface px-0 pb-6 lg:hidden">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <h1 className="truncate text-4xl font-semibold leading-tight text-text-primary">
      {isEdit ? "Edit Order" : "Create Order"}
    </h1>
  </div>
);

/**
 * Render desktop form header.
 * @param {string} title - Form title
 * @param {() => void} onBack - Back navigation
 * @returns {React.ReactElement} Header section
 */
const _renderHeaderSection = (
  title: string,
  onBack: () => void,
): React.ReactElement => (
  <>
    <nav
      aria-label="Breadcrumb"
      className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"
    >
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer hover:text-text-primary"
      >
        Order
      </button>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">{title}</span>
    </nav>
    <div className="my-6 hidden pl-1 lg:block">
      <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">
        {title === "Edit Order"
          ? "Update the order details below."
          : "Fill in the order details below."}
      </p>
    </div>
  </>
);

/**
 * Render Order Create form.
 * @param {OrderCreateProps} props - Form props
 * @returns {React.ReactElement} Order form
 */
export const OrderCreateComponent = (
  props: OrderCreateProps,
): React.ReactElement => {
  /**
   * Handle input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleAddress = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
    props.onChange("address", event.target.value);
  /**
   * Handle input change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleRemarks = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
    props.onChange("remarks", event.target.value);

  const pageTitle = props.isEdit ? "Edit Order" : "Create Order";
  const submitLabel = props.isSubmitting ? "Saving…" : pageTitle;
  const totals = calculateOrderTotals(
    props.form.rental_transaction_items.filter((item) => item.item_id),
    props.form.discount,
    props.form.service_fee,
  );

  const isLastStep = props.step === 3;
  const stepTitles = ["Order Information", "Rental Items", "Review"];
  const isHandoverOrderType = props.orderTypes.some(
    (orderType) => orderType.id === props.form.order_type_id && orderType.is_handover,
  );
  const isInformationStepError = props.showInformationErrors;
  const isItemsStepError = props.showItemErrors;

  return (
    <Layout pageTitle={pageTitle} mobileWhiteBackground>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(props.isEdit, props.onBack)}
        <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:text-base">
          {_renderHeaderSection(pageTitle, props.onBack)}
          <form
            noValidate
            onSubmit={props.onPreventSubmit}
            className="mb-5 flex flex-col justify-between border-0 bg-transparent p-0 pb-32 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs"
          >
            <div className="mb-8 flex items-center gap-8 overflow-x-auto border-b border-border-default">
              {stepTitles.map((title, index) => {
                const hasError =
                  (index === 0 && isInformationStepError) ||
                  (index === 1 && isItemsStepError);

                return (
                  <div
                    key={title}
                    className={`relative shrink-0 pb-3 text-xl lg:text-base ${_getStepTabClass(index, props.step, hasError)}`}
                  >
                    <span>{title}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-0.5 ${_getStepUnderlineClass(index, props.step)}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="pb-6">
              {props.step === 1 && (
                <section className="space-y-5">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                    {_renderSelect(props)}
                    {_renderField(props, {
                      field: "customer_name",
                      label: "Customer Name",
                      placeholder: "Enter customer name",
                    })}
                    {_renderField(props, {
                      field: "customer_phone",
                      label: "Customer Phone",
                      placeholder: "Enter customer phone number",
                    })}
                    {_renderPicSelect(props)}
                    {_renderDateRange(props)}
                    {_renderServiceTypeSelect(props)}
                    {_renderServiceFee(props)}
                    {_renderField(props, {
                      field: "event_name",
                      label: "Event Name",
                      placeholder: "Enter event name",
                    })}
                    {_renderOrderTypeSelect(props)}
                    {isHandoverOrderType && (
                      <>
                        {_renderHandoverTypeSelect(props)}
                        {_renderField(props, {
                          field: "handover_name",
                          label: "ID Owner Name",
                          placeholder: "Enter ID owner name",
                        })}
                      </>
                    )}
                    {_renderVoucherSelect(props)}
                  </div>
                  <label className="block space-y-2">
                    <span className="text-lg font-semibold text-text-primary">
                      Address
                    </span>
                    <textarea
                      value={props.form.address}
                      onChange={handleAddress}
                      placeholder="Enter address"
                      className="min-h-36 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:font-normal placeholder:text-xl placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30"
                    />
                  </label>
                </section>
              )}
              {props.step === 2 && (
                <section className="space-y-4">
                  {props.form.service_type_name.trim().toUpperCase() ===
                  "PROJECT" ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {props.projects.map((project) => (
                        <React.Fragment key={project.id}>
                          {_renderProjectCard(props, project)}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <>
                      {props.isItemsLoading && (
                        <p className="text-sm text-text-secondary">
                          Loading items…
                        </p>
                      )}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {props.items.map((item) => (
                          <React.Fragment key={item.id}>
                            {_renderItemCard(props, item)}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}
              {props.step === 3 && (
                <section className="flex flex-col gap-6">
                  <div className="order-1 grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <div className="rounded-2xl border border-border-default bg-background-surface p-5 lg:col-span-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div>
                          <p className="text-xl font-semibold text-text-primary lg:text-sm">
                            Customer Information
                          </p>
                          <p className="text-base text-text-secondary lg:text-xs">
                            Contact and delivery details
                          </p>
                        </div>
                      </div>
                      <dl className="divide-y divide-border-default text-xl lg:text-sm">
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Customer</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.customers.find((customer) => customer.id === props.form.customer_id)?.name || "-"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Name</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.form.customer_name || "-"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Phone</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.form.customer_phone || "-"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Address</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.form.address || "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="rounded-2xl border border-border-default bg-background-surface p-5 lg:col-span-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div>
                          <p className="text-xl font-semibold text-text-primary lg:text-sm">
                            Order Information
                          </p>
                          <p className="text-base text-text-secondary lg:text-xs">
                            Schedule, type, and handover
                          </p>
                        </div>
                      </div>
                      <dl className="divide-y divide-border-default text-xl lg:text-sm">
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">PIC</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.pics.find((pic) => pic.id === props.form.pic_id)?.name || "-"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Event</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.form.event_name || "-"}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Order Type</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.orderTypes.find((orderType) => orderType.id === props.form.order_type_id)?.name || "-"}
                          </dd>
                        </div>
                        {isHandoverOrderType && (
                          <>
                            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                              <dt className="text-text-secondary">ID Type</dt>
                              <dd className="break-words font-semibold text-text-primary">
                                {props.form.handover_type || "-"}
                              </dd>
                            </div>
                            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                              <dt className="text-text-secondary">Owner</dt>
                              <dd className="break-words font-semibold text-text-primary">
                                {props.form.handover_name || "-"}
                              </dd>
                            </div>
                          </>
                        )}
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Service</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {props.serviceTypes.find((serviceType) => serviceType.id === props.form.service_type_id)?.name || props.form.service_type_name || "-"}
                          </dd>
                        </div>
                        {props.form.voucher_id && (
                          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                            <dt className="text-text-secondary">Voucher</dt>
                            <dd className="break-words font-semibold text-text-primary">
                              {props.vouchers.find((voucher) => voucher.id === props.form.voucher_id)?.name || "-"}
                            </dd>
                          </div>
                        )}
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">Start</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {_formatReviewDate(props.form.start_at)}
                          </dd>
                        </div>
                        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 lg:grid-cols-[6rem_minmax(0,1fr)]">
                          <dt className="text-text-secondary">End</dt>
                          <dd className="break-words font-semibold text-text-primary">
                            {_formatReviewDate(props.form.end_at)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="order-3 rounded-2xl border border-action-primary/30 p-5 lg:order-2">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xl font-semibold text-text-primary lg:text-sm">
                            Pricing
                          </p>
                          <p className="text-base text-text-secondary lg:text-xs">
                            Order cost breakdown
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary lg:text-xs">
                        IDR
                      </span>
                    </div>
                    <div className="grid gap-3 text-xl sm:grid-cols-2 lg:grid-cols-4 lg:text-sm">
                      <div className="rounded-xl bg-background-subtle p-4 text-text-secondary">
                        <span className="block text-base text-text-secondary lg:text-xs">Subtotal</span>
                        <span className="mt-1 block font-semibold text-text-primary">
                          Rp {totals.subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="rounded-xl bg-background-subtle p-4 text-text-secondary">
                        <span className="block text-base text-text-secondary lg:text-xs">Service Fee</span>
                        <span className="mt-1 block font-semibold text-text-primary">
                          Rp {props.form.service_fee.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="rounded-xl bg-background-subtle p-4 text-text-secondary">
                        <span className="block text-base text-text-secondary lg:text-xs">Discount</span>
                        <span className="mt-1 block font-semibold text-text-primary">
                          Rp {props.form.discount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="rounded-xl bg-action-primary-subtle p-4">
                        <span className="block text-base font-semibold text-action-primary lg:text-xs">Grand Total</span>
                        <span className="mt-1 block text-3xl font-bold text-action-primary lg:text-lg">
                          Rp {totals.grandTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="order-2 rounded-xl border border-border-default p-4 lg:order-3">
                    <h3 className="mb-3 text-2xl font-semibold text-text-primary lg:text-base">
                      Rental Items
                    </h3>
                    {props.form.service_type_name.trim().toUpperCase() ===
                    "PROJECT" ? (
                      <div className="space-y-3">
                        {props.projects
                          .filter((project) =>
                            props.form.rental_transaction_items.some(
                              (item) => item.project_id === project.id,
                            ),
                          )
                          .map((project) => {
                            const projectItems =
                              props.form.rental_transaction_items.filter(
                                (item) => item.project_id === project.id,
                              );

                            return (
                              <section
                                key={project.id}
                                className="overflow-hidden rounded-2xl border border-border-default bg-background-surface"
                              >
                                <div className="flex items-center justify-between gap-3 border-b border-border-default bg-background-subtle px-4 py-3">
                                  <h4 className="text-xl font-semibold text-text-primary lg:text-base">
                                    {project.name}
                                  </h4>
                                  <span className="shrink-0 rounded-full bg-action-primary-subtle px-3 py-1 text-base font-semibold text-action-primary lg:text-xs">
                                    {projectItems.length} items
                                  </span>
                                </div>
                                <div className="divide-y divide-border-default px-4">
                                  {projectItems.map((item) => (
                                    <div
                                      key={`${project.id}-${item.item_id}`}
                                      className="grid gap-2 py-4 text-xl sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:text-sm"
                                    >
                                      <div className="min-w-0">
                                        <p className="break-words font-semibold text-text-primary">
                                          {item.item_name || item.item_id}
                                        </p>
                                        <p className="mt-1 text-lg text-text-secondary lg:text-xs">
                                          Qty {item.qty} × Rp{" "}
                                          {item.price.toLocaleString("id-ID")}
                                        </p>
                                        {item.remark && (
                                          <p className="mt-1 break-words text-lg text-text-secondary lg:text-xs">
                                            {item.remark}
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-semibold text-text-primary sm:text-right">
                                        Rp{" "}
                                        {item.subtotal.toLocaleString("id-ID")}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {props.form.rental_transaction_items
                          .filter((item) => item.item_id)
                          .map((item) => (
                            <div
                              key={`${item.item_id}-${item.remark}`}
                              className="flex items-start justify-between gap-3 rounded-xl border border-border-default p-3 text-xl lg:text-sm"
                            >
                              <span>
                                {item.item_name}
                                <span className="ml-2 text-text-secondary">
                                  Qty: {item.qty}
                                </span>
                                {item.remark && (
                                  <span className="ml-2 text-text-secondary">
                                    · {item.remark}
                                  </span>
                                )}
                              </span>
                              <span className="font-semibold text-text-primary whitespace-nowrap">
                                Rp {item.subtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <label className="order-4 block space-y-2">
                    <span className="text-xl font-semibold text-text-secondary lg:text-xs">
                      Remarks
                    </span>
                    <textarea
                      value={props.form.remarks}
                      onChange={handleRemarks}
                      className="min-h-24 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 text-xl font-semibold outline-none placeholder:font-normal placeholder:text-xl"
                    />
                  </label>
                </section>
              )}
              {props.errorMessage && (
                <p
                  role="alert"
                  className="mt-4 text-sm font-medium text-danger"
                >
                  {props.errorMessage}
                </p>
              )}
            </div>
            <div className="flex justify-between border-t border-border-default pt-5">
              <button
                type="button"
                disabled={props.step === 1}
                onClick={props.onPreviousStep}
                className="h-14 rounded-xl border border-border-default px-8 font-semibold text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  disabled={props.isSubmitting}
                  type="button"
                  onClick={props.onSubmit}
                  className="h-14 rounded-xl bg-action-primary px-8 font-semibold text-text-inverse disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={props.onNextStep}
                  className="h-14 rounded-xl bg-action-primary px-8 font-semibold text-text-inverse"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
