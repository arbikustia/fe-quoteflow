import * as React from "react";

import { BackButton } from "@/components/BackButton";
import { DateRangePicker } from "@/components/DateRangePicker";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";

import type { OrderItemPayload } from "../Order.type";

import type {
  OrderCreateFormState,
  OrderCreateProps,
  OrderItemOption,
  OrderProjectOption,
  SelectOption,
} from "./OrderCreate.type";
import { calculateOrderTotals, clampQtyToStock } from "./OrderCreate.util";

import Layout from "@/app/layout";

const RUPIAH_FORMATTER = new Intl.NumberFormat("id-ID");

/**
 * Format date for review display without T separator.
 * @param {string} [value] - ISO date string.
 * @returns {string} Formatted date.
 */
const _formatReviewDate = (value?: string): string => {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

/**
 * Render _renderSelect.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rendered element.
 */
const _renderSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-customer"
    label="Customer"
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
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
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
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
const _renderOrderTypeSelect = (
  props: OrderCreateProps,
): React.ReactElement => (
  <Select
    id="order-order-type"
    label="Order Type"
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
    required
    errorMessage={
      props.showInformationErrors && !props.form.order_type_id.trim()
        ? "Order Type is required"
        : undefined
    }
    value={props.form.order_type_id}
    onChange={props.onOrderTypeChange}
    disabled={props.isOrderTypesLoading}
    placeholder={
      props.isOrderTypesLoading ? "Loading order types…" : "Select order type"
    }
    options={props.orderTypes.map((orderType) => ({
      value: orderType.id,
      label: orderType.name,
    }))}
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
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
    required
    errorMessage={
      props.showInformationErrors && !props.form.handover_type.trim()
        ? "Identity Type is required"
        : undefined
    }
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
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
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
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
    value={props.form.voucher_id ?? ""}
    onChange={props.onVoucherChange}
    disabled={props.isVouchersLoading}
    isClearable
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
 * Check whether the selected end date is earlier than the start date.
 * @param {OrderCreateFormState} form - Order form state.
 * @returns {boolean} True when end date precedes start date.
 */
const _isEndBeforeStart = (form: OrderCreateFormState): boolean =>
  Boolean(
    form.start_at &&
    form.end_at &&
    form.end_at.slice(0, 10) < form.start_at.slice(0, 10),
  );

/**
 * Create start date change handler that keeps end date in range.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {(value: string) => void} Start date change handler.
 */
const _createStartDateChangeHandler =
  (props: OrderCreateProps) =>
  (value: string): void => {
    props.onChange("start_at", value);

    if (
      props.form.end_at &&
      value &&
      value.slice(0, 10) > props.form.end_at.slice(0, 10)
    ) {
      props.onChange("end_at", value);
    }
  };

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
  const handleEndDateChange = (value: string): void =>
    props.onChange("end_at", value);
  const isEndBeforeStart = _isEndBeforeStart(props.form);

  return (
    <DateRangePicker
      className="mb-0 lg:col-span-2 [&>div]:gap-5 [&_.ant-picker]:!h-16 lg:[&_.ant-picker]:!h-14 [&_.ant-picker]:!rounded-2xl [&_.ant-picker]:!border-2 [&_.ant-picker:not(.ant-picker-status-error)]:!border-border-strong [&_.ant-picker.ant-picker-status-error]:!border-danger [&_.ant-picker-input>input]:!text-xl lg:[&_.ant-picker-input>input]:!text-lg [&_.ant-picker-input>input]:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary"
      startLabel="Start Date *"
      endLabel="End Date *"
      startDate={props.form.start_at}
      endDate={props.form.end_at}
      startError={props.showInformationErrors && !props.form.start_at.trim()}
      endError={
        props.showInformationErrors &&
        (!props.form.end_at.trim() || isEndBeforeStart)
      }
      endErrorMessage={
        isEndBeforeStart
          ? "End date cannot be earlier than start date"
          : undefined
      }
      onStartDateChange={_createStartDateChangeHandler(props)}
      onEndDateChange={handleEndDateChange}
      showTime
    />
  );
};

/**
 * Render a form input field.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderCreateFormState} config - Field configuration.
 * @returns {React.ReactElement} Rendered field.
 */
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
      className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
        isInvalid
          ? "[&_.ant-input]:!border-danger"
          : "[&_.ant-input]:!border-border-strong"
      } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
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
      className="!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input]:!border-border-strong [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary"
    />
  );
};

/**
 * Resolve project card border and background classes.
 * @param {boolean} isSelected - Whether the project is selected.
 * @param {boolean} hasError - Whether the item step shows an error.
 * @returns {string} Card state classes.
 */
const _getProjectCardClass = (
  isSelected: boolean,
  hasError: boolean,
): string => {
  if (isSelected) {
    return "border-action-primary bg-action-primary-subtle/20 shadow-xs";
  }

  if (hasError) {
    return "border-danger bg-background-surface";
  }

  return "border-border-default bg-background-surface";
};

/**
 * Render project folder icon.
 * @returns {React.ReactElement} Folder icon.
 */
const _renderProjectFolderIcon = (): React.ReactElement => (
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
);

/**
 * Render project name, item count, and daily price.
 * @param {OrderProjectOption} project - Project option.
 * @returns {React.ReactElement} Project summary.
 */
const _renderProjectSummary = (
  project: OrderProjectOption,
): React.ReactElement => (
  <div className="min-w-0">
    <div className="flex items-center gap-2">
      <strong className="truncate text-lg font-bold text-text-primary">
        {project.name}
      </strong>
      <span className="shrink-0 rounded-full bg-action-primary-subtle px-2.5 py-0.5 text-lg font-semibold text-action-primary">
        {project.items.length} items
      </span>
    </div>
    {project.price > 0 && (
      <p className="mt-0.5 text-lg font-medium text-text-secondary">
        Price / day: Rp {project.price.toLocaleString("id-ID")}
      </p>
    )}
  </div>
);

/**
 * Render project selection check badge.
 * @param {boolean} isSelected - Whether the project is selected.
 * @returns {React.ReactElement} Check badge.
 */
const _renderProjectCheck = (isSelected: boolean): React.ReactElement => (
  <span
    aria-hidden="true"
    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-lg font-bold transition-colors ${isSelected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default bg-background-surface text-transparent"}`}
  >
    ✓
  </span>
);

/**
 * Render project toggle button.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderProjectOption} project - Project option.
 * @param {boolean} isSelected - Whether the project is selected.
 * @returns {React.ReactElement} Project toggle button.
 */
const _renderProjectToggle = (
  props: OrderCreateProps,
  project: OrderProjectOption,
  isSelected: boolean,
): React.ReactElement => {
  /**
   * Handle toggling project selection.
   * @returns {void} No return value.
   */
  const handleToggle = (): void => props.onToggleProject(project.id);

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isSelected}
      className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-background-subtle/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
    >
      <div className="flex min-w-0 items-center gap-3">
        {_renderProjectFolderIcon()}
        {_renderProjectSummary(project)}
      </div>
      {_renderProjectCheck(isSelected)}
    </button>
  );
};

/**
 * Render project item thumbnail or placeholder icon.
 * @param {string} itemName - Item display name.
 * @param {OrderItemOption} [itemDetail] - Matching item option.
 * @returns {React.ReactElement} Item thumbnail.
 */
const _renderProjectItemThumbnail = (
  itemName: string,
  itemDetail?: OrderItemOption,
): React.ReactElement =>
  itemDetail?.image ? (
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
  );

/**
 * Render an item included in a project.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderProjectOption} project - Project option.
 * @param {OrderProjectOption["items"][number]} item - Project item.
 * @returns {React.ReactElement} Project item row.
 */
const _renderProjectIncludedItem = (
  props: OrderCreateProps,
  project: OrderProjectOption,
  item: OrderProjectOption["items"][number],
): React.ReactElement => {
  const itemDetail = props.items.find((option) => option.id === item.item_id);
  const itemName = item.item_name ?? itemDetail?.name ?? item.item_id;

  return (
    <div
      key={`${project.id}-${item.item_id}`}
      className="flex items-center gap-3 rounded-xl border border-border-default/80 bg-background-surface p-2.5 shadow-2xs"
    >
      {_renderProjectItemThumbnail(itemName, itemDetail)}
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-text-primary">
          {itemName}
        </p>
        <div className="mt-1 flex items-center gap-2 text-lg">
          <span className="rounded bg-action-primary-subtle px-1.5 py-0.5 font-semibold text-action-primary">
            Qty: {item.qty}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Render project remark input.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderProjectOption} project - Project option.
 * @param {boolean} isSelected - Whether the project is selected.
 * @returns {React.ReactElement} Project remark field.
 */
const _renderProjectRemark = (
  props: OrderCreateProps,
  project: OrderProjectOption,
  isSelected: boolean,
): React.ReactElement => {
  const projectHeaderIndex = props.form.rental_transaction_items.findIndex(
    (item) => item.project_id === project.id && item.item_id === project.id,
  );
  const projectRemark =
    props.form.rental_transaction_items[projectHeaderIndex]?.remark ?? "";
  /**
   * Handle project remark change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleRemarkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void =>
    props.onItemChange(projectHeaderIndex, "remark", event.target.value);

  return (
    <label className="mt-4 block space-y-2">
      <span className="text-lg font-semibold text-text-secondary">
        Project Remark
      </span>
      <input
        aria-label="Project Remark"
        value={projectRemark}
        disabled={!isSelected}
        onChange={handleRemarkChange}
        placeholder="Add a remark for this project"
        className="w-full rounded-lg border border-border-default px-3 py-2 text-lg"
      />
    </label>
  );
};

/**
 * Render items included in a project with project remark.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderProjectOption} project - Project option.
 * @param {boolean} isSelected - Whether the project is selected.
 * @returns {React.ReactElement} Included items section.
 */
const _renderProjectIncludedItems = (
  props: OrderCreateProps,
  project: OrderProjectOption,
  isSelected: boolean,
): React.ReactElement => (
  <div className="border-t border-border-default/70 bg-background-subtle/30 p-4">
    <p className="mb-2.5 text-lg font-bold uppercase tracking-wider text-text-secondary">
      Items Included
    </p>
    {project.items.length === 0 ? (
      <p className="text-lg italic text-text-tertiary">
        No items in this project
      </p>
    ) : (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {project.items.map((item) =>
          _renderProjectIncludedItem(props, project, item),
        )}
      </div>
    )}
    {_renderProjectRemark(props, project, isSelected)}
  </div>
);

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

  return (
    <div
      key={project.id}
      className={`flex flex-col overflow-hidden rounded-2xl border transition-colors ${_getProjectCardClass(isSelected, hasError)}`}
    >
      {_renderProjectToggle(props, project, isSelected)}
      {_renderProjectIncludedItems(props, project, isSelected)}
    </div>
  );
};

/**
 * Create quantity step click handler with stock clamping.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemPayload} item - Selected item row.
 * @param {[number, string, (number | null), string]} config - Control configuration.
 * @param {number} delta - Step direction.
 * @returns {() => void} Click handler.
 */
const _createQtyStepHandler =
  (
    props: OrderCreateProps,
    item: OrderItemPayload,
    config: [number, string, number | null, string],
    delta: number,
  ) =>
  (): void => {
    const [index, , stock] = config;
    const nextQty =
      stock === null
        ? item.qty + delta
        : clampQtyToStock(item.qty + delta, stock);

    props.onItemChange(index, "qty", Math.max(1, nextQty));
  };

/**
 * Render quantity decrease or increase button.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemPayload} item - Selected item row.
 * @param {[number, string, (number | null), string]} config - Control configuration.
 * @param {number} delta - Step direction.
 * @returns {React.ReactElement} Quantity step button.
 */
const _renderQtyStepButton = (
  props: OrderCreateProps,
  item: OrderItemPayload,
  config: [number, string, number | null, string],
  delta: number,
): React.ReactElement => {
  const [, , stock, sizeClass] = config;
  const maxQty = stock === null ? Number.POSITIVE_INFINITY : stock;
  const isDecrease = delta < 0;

  return (
    <button
      type="button"
      onClick={_createQtyStepHandler(props, item, config, delta)}
      disabled={isDecrease ? item.qty <= 1 : item.qty >= maxQty}
      aria-label={`${isDecrease ? "Decrease" : "Increase"} ${item.item_name} quantity`}
      className={`${sizeClass} flex w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-border-strong bg-background-surface text-xl font-bold text-text-primary transition-colors hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {isDecrease ? "−" : "+"}
    </button>
  );
};

/**
 * Render quantity number input.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemPayload} item - Selected item row.
 * @param {[number, string, (number | null), string]} config - Control configuration.
 * @returns {React.ReactElement} Quantity input.
 */
const _renderQtyInput = (
  props: OrderCreateProps,
  item: OrderItemPayload,
  config: [number, string, number | null, string],
): React.ReactElement => {
  const [index, itemId, stock, sizeClass] = config;
  /**
   * Handle quantity input change with stock clamping.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event.
   * @returns {void} Nothing.
   */
  const handleQtyChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    props.onItemChange(
      index,
      "qty",
      stock === null
        ? Number(event.target.value)
        : clampQtyToStock(Number(event.target.value), stock),
    );

  return (
    <input
      id={`order-qty-${itemId}`}
      type="number"
      min="1"
      max={stock ?? undefined}
      value={item.qty}
      aria-label="Qty"
      onChange={handleQtyChange}
      className={`${sizeClass} w-14 rounded-lg border-2 border-border-strong bg-background-surface px-1 text-center text-lg text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
    />
  );
};

/**
 * Render quantity stepper with decrease and increase buttons.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemPayload} item - Selected item row.
 * @param {[number, string, (number | null), string]} config - Control configuration.
 * @returns {React.ReactElement} Quantity stepper.
 */
const _renderQtyControl = (
  props: OrderCreateProps,
  item: OrderItemPayload,
  config: [number, string, number | null, string],
): React.ReactElement => (
  <div className="flex items-center gap-1">
    {_renderQtyStepButton(props, item, config, -1)}
    {_renderQtyInput(props, item, config)}
    {_renderQtyStepButton(props, item, config, 1)}
  </div>
);

/**
 * Resolve item card border and background classes.
 * @param {boolean} isSelected - Whether the item is selected.
 * @param {boolean} hasError - Whether the item step shows an error.
 * @returns {string} Card state classes.
 */
const _getItemCardClass = (isSelected: boolean, hasError: boolean): string => {
  if (hasError) {
    return "border-danger bg-background-surface";
  }

  if (isSelected) {
    return "border-action-primary bg-action-primary-subtle";
  }

  return "border-border-default bg-background-surface";
};

/**
 * Create item remark change handler.
 * @param {OrderCreateProps} props - Component properties.
 * @param {number} index - Item row index.
 * @returns {(event: React.ChangeEvent<HTMLInputElement>) => void} Change handler.
 */
const _createItemRemarkHandler =
  (props: OrderCreateProps, index: number) =>
  (event: React.ChangeEvent<HTMLInputElement>): void =>
    props.onItemChange(index, "remark", event.target.value);

/**
 * Render item image or placeholder.
 * @param {OrderItemOption} option - Item option.
 * @returns {React.ReactElement} Item thumbnail.
 */
const _renderItemCardThumbnail = (
  option: OrderItemOption,
): React.ReactElement =>
  option.image ? (
    <img
      src={option.image}
      alt=""
      className="h-12 w-12 shrink-0 rounded-lg object-cover"
    />
  ) : (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-lg text-text-tertiary">
      No image
    </div>
  );

/**
 * Render item name, stock, and price summary.
 * @param {OrderItemOption} option - Item option.
 * @returns {React.ReactElement} Item summary.
 */
const _renderItemCardSummary = (
  option: OrderItemOption,
): React.ReactElement => (
  <span className="min-w-0 flex-1">
    <strong className="block truncate text-lg font-semibold text-text-primary">
      {option.name}
    </strong>
    <small className="mt-1 block truncate text-text-secondary">
      Stock: {option.stock ?? 0} · Rp{" "}
      {(option.price ?? 0).toLocaleString("id-ID")}
    </small>
  </span>
);

/**
 * Render item selection check badge.
 * @param {boolean} isSelected - Whether the item is selected.
 * @returns {React.ReactElement} Check badge.
 */
const _renderItemCardCheck = (isSelected: boolean): React.ReactElement => (
  <span
    aria-hidden="true"
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-lg ${isSelected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}
  >
    ✓
  </span>
);

/**
 * Render desktop quantity and remark controls for a selected item.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemOption} option - Item option.
 * @param {OrderItemPayload} selected - Selected item row.
 * @returns {React.ReactElement} Desktop controls.
 */
const _renderItemCardDesktopControls = (
  props: OrderCreateProps,
  option: OrderItemOption,
  selected: OrderItemPayload,
): React.ReactElement => {
  const selectedIndex = props.form.rental_transaction_items.indexOf(selected);

  return (
    <div className="pointer-events-auto hidden shrink-0 items-center gap-3 lg:flex">
      <div className="flex flex-col gap-1 text-lg font-medium text-text-secondary">
        <span>Qty</span>
        {_renderQtyControl(props, selected, [
          selectedIndex,
          option.id,
          option.stock,
          "h-10",
        ])}
      </div>
      <label className="flex w-40 flex-col gap-1 text-lg font-medium text-text-secondary">
        Remark
        <input
          id={`order-remark-${option.id}`}
          value={selected.remark}
          onChange={_createItemRemarkHandler(props, selectedIndex)}
          placeholder="Optional note"
          className="h-10 w-full rounded-lg border-2 border-border-strong bg-background-surface px-3 text-lg text-text-primary placeholder:text-text-tertiary"
        />
      </label>
    </div>
  );
};

/**
 * Render mobile quantity and remark controls for a selected item.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderItemOption} option - Item option.
 * @param {OrderItemPayload} selected - Selected item row.
 * @returns {React.ReactElement} Mobile controls.
 */
const _renderItemCardMobileControls = (
  props: OrderCreateProps,
  option: OrderItemOption,
  selected: OrderItemPayload,
): React.ReactElement => {
  const selectedIndex = props.form.rental_transaction_items.indexOf(selected);

  return (
    <div className="relative z-10 mt-4 grid grid-cols-[9rem_minmax(0,1fr)] gap-3 border-t border-border-default pt-4 lg:hidden">
      <div className="flex flex-col gap-2 text-lg font-medium text-text-secondary">
        <span>Qty</span>
        {_renderQtyControl(props, selected, [
          selectedIndex,
          option.id,
          option.stock,
          "h-12",
        ])}
      </div>
      <label className="flex min-w-0 flex-col gap-2 text-lg font-medium text-text-secondary">
        Remark
        <input
          value={selected.remark}
          onChange={_createItemRemarkHandler(props, selectedIndex)}
          placeholder="Optional note"
          className="h-12 w-full rounded-lg border-2 border-border-strong bg-background-surface px-3 text-lg text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
        />
      </label>
    </div>
  );
};

/**
 * Render _renderItemCard.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderCreateProps["items"][number]} option - Render option.
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
  /**
   * Handle toggling item selection.
   * @returns {void} Nothing.
   */
  const handleToggle = (): void => props.onToggleItem(option.id);

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-colors ${_getItemCardClass(Boolean(selected), hasError)}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Select ${option.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
      />
      <div className="pointer-events-none relative z-10 flex min-w-0 items-start gap-3">
        {_renderItemCardThumbnail(option)}
        {_renderItemCardSummary(option)}
        {selected && _renderItemCardDesktopControls(props, option, selected)}
        {_renderItemCardCheck(Boolean(selected))}
      </div>
      {selected && _renderItemCardMobileControls(props, option, selected)}
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

/**
 * Resolve the active step underline class.
 * @param {number} index - Step index.
 * @param {number} step - Current step.
 * @returns {string} Underline class.
 */
const _getStepUnderlineClass = (index: number, step: number): string =>
  step === index + 1 ? "bg-action-primary" : "bg-transparent";

/**
 * Render the mobile page header.
 * @param {boolean} isEdit - Whether editing an order.
 * @param {() => void} onBack - Back handler.
 * @returns {React.ReactElement} Mobile header.
 */
const _renderMobileBack = (
  isEdit: boolean,
  onBack: () => void,
): React.ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <BackButton onClick={onBack} />
    <div className="min-w-0">
      <h1 className="truncate text-4xl font-semibold leading-tight text-text-primary">
        {isEdit ? "Edit Order" : "Create Order"}
      </h1>
      <p className="mt-1 text-lg text-text-secondary">
        {isEdit ? "Update order details" : "Fill in order details"}
      </p>
    </div>
  </div>
);

/**
 * Render desktop form header.
 * @param {string} title - Form title
 * @returns {React.ReactElement} Header section
 */
const _renderHeaderSection = (title: string): React.ReactElement => (
  <div className="mb-6 hidden lg:block">
    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
      {title}
    </h1>
    <p className="mt-3 text-lg font-medium text-text-secondary opacity-70">
      {title === "Edit Order"
        ? "Update the order details below."
        : "Fill in the order details below."}
    </p>
  </div>
);

/**
 * Check whether the selected order type requires handover identity.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {boolean} True when the order type is a handover type.
 */
const _isHandoverOrderType = (props: OrderCreateProps): boolean =>
  props.orderTypes.some(
    (orderType) =>
      orderType.id === props.form.order_type_id && orderType.is_handover,
  );

/**
 * Check whether the selected service type is project based.
 * @param {OrderCreateFormState} form - Order form state.
 * @returns {boolean} True when the service type is PROJECT.
 */
const _isProjectService = (form: OrderCreateFormState): boolean =>
  form.service_type_name.trim().toUpperCase() === "PROJECT";

/**
 * Find option name by id, or use the default name.
 * @param {SelectOption[]} options - Selectable options.
 * @param {string} id - Selected option id.
 * @param {string} defaultName - Name used when no option name is available.
 * @returns {string} Option name.
 */
const _getOptionNameOrDefault = (
  options: SelectOption[],
  id: string,
  defaultName: string,
): string => options.find((option) => option.id === id)?.name || defaultName;

/**
 * Render a single step tab.
 * @param {OrderCreateProps} props - Component properties.
 * @param {string} title - Step title.
 * @param {number} index - Step index.
 * @returns {React.ReactElement} Step tab.
 */
const _renderStepTab = (
  props: OrderCreateProps,
  title: string,
  index: number,
): React.ReactElement => {
  const hasError =
    (index === 0 && props.showInformationErrors) ||
    (index === 1 && props.showItemErrors);

  return (
    <div
      key={title}
      aria-current={props.step === index + 1 ? "step" : undefined}
      className={`relative shrink-0 pb-3 text-lg lg:text-lg ${_getStepTabClass(index, props.step, hasError)}`}
    >
      <span className="lg:hidden">{index === 0 ? "Information" : title}</span>
      <span className="hidden lg:inline">{title}</span>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-0.5 ${_getStepUnderlineClass(index, props.step)}`}
      />
    </div>
  );
};

/**
 * Render order step tabs.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Step tabs.
 */
const _renderStepTabs = (props: OrderCreateProps): React.ReactElement => {
  const stepTitles = ["Order Information", "Rental Items", "Review"];

  return (
    <div
      aria-label="Order steps"
      className="mb-6 flex items-center gap-4 overflow-x-auto border-b border-border-default lg:mb-8 lg:gap-8"
    >
      {stepTitles.map((title, index) => _renderStepTab(props, title, index))}
    </div>
  );
};

/**
 * Render handover identity fields.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Handover fields.
 */
const _renderHandoverFields = (props: OrderCreateProps): React.ReactElement => (
  <>
    {_renderHandoverTypeSelect(props)}
    {_renderField(props, {
      field: "handover_name",
      label: "ID Owner Name",
      placeholder: "Enter ID owner name",
    })}
  </>
);

/**
 * Render order information fields grid.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Information fields.
 */
const _renderInformationFields = (
  props: OrderCreateProps,
): React.ReactElement => (
  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
    {_isHandoverOrderType(props) && _renderHandoverFields(props)}
    {_renderVoucherSelect(props)}
  </div>
);

/**
 * Render address textarea.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Address field.
 */
const _renderAddressField = (props: OrderCreateProps): React.ReactElement => {
  /**
   * Handle address change.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - Textarea event.
   * @returns {void} Nothing.
   */
  const handleAddress = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
    props.onChange("address", event.target.value);

  return (
    <label className="block space-y-2">
      <span className="text-lg font-normal text-text-primary lg:text-lg">
        Address
      </span>
      <textarea
        value={props.form.address}
        onChange={handleAddress}
        placeholder="Enter address"
        className="min-h-36 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:font-normal placeholder:text-xl placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg lg:placeholder:text-lg"
      />
    </label>
  );
};

/**
 * Render order information step.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Information step.
 */
const _renderInformationStep = (
  props: OrderCreateProps,
): React.ReactElement => (
  <section className="space-y-5">
    {_renderInformationFields(props)}
    {_renderAddressField(props)}
  </section>
);

/**
 * Render selectable project cards grid.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Project grid.
 */
const _renderProjectGrid = (props: OrderCreateProps): React.ReactElement => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {props.projects.map((project) => (
      <React.Fragment key={project.id}>
        {_renderProjectCard(props, project)}
      </React.Fragment>
    ))}
  </div>
);

/**
 * Render selectable item cards grid with loading state.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Item grid.
 */
const _renderItemGrid = (props: OrderCreateProps): React.ReactElement => (
  <>
    {props.isItemsLoading && (
      <p className="text-lg text-text-secondary">Loading items…</p>
    )}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {props.items.map((item) => (
        <React.Fragment key={item.id}>
          {_renderItemCard(props, item)}
        </React.Fragment>
      ))}
    </div>
  </>
);

/**
 * Render rental items step.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Items step.
 */
const _renderItemsStep = (props: OrderCreateProps): React.ReactElement => (
  <section className="space-y-4">
    {_isProjectService(props.form)
      ? _renderProjectGrid(props)
      : _renderItemGrid(props)}
  </section>
);

/**
 * Render review card title and subtitle.
 * @param {string} title - Card title.
 * @param {string} subtitle - Card subtitle.
 * @returns {React.ReactElement} Card title block.
 */
const _renderReviewCardTitle = (
  title: string,
  subtitle: string,
): React.ReactElement => (
  <div>
    <p className="text-xl font-semibold text-text-primary lg:text-lg">
      {title}
    </p>
    <p className="text-lg text-text-secondary lg:text-lg">{subtitle}</p>
  </div>
);

/**
 * Render a review description entry.
 * @param {string} label - Entry label.
 * @param {string} value - Entry value.
 * @param {boolean} [isLastEntry] - Whether the entry has no bottom divider.
 * @returns {React.ReactElement} Review entry.
 */
const _renderReviewEntry = (
  label: string,
  value: string,
  isLastEntry?: boolean,
): React.ReactElement => (
  <div className={isLastEntry ? "py-3" : "border-b border-border-default py-3"}>
    <dt className="text-text-secondary">{label}</dt>
    <dd className="mt-1 break-words font-semibold text-text-primary">
      {value}
    </dd>
  </div>
);

/**
 * Render a review card with description entries.
 * @param {string} title - Card title.
 * @param {string} subtitle - Card subtitle.
 * @param {React.ReactElement} entries - Description entries.
 * @returns {React.ReactElement} Review card.
 */
const _renderReviewCard = (
  title: string,
  subtitle: string,
  entries: React.ReactElement,
): React.ReactElement => (
  <div className="rounded-2xl bg-background-subtle p-5">
    <div className="mb-4 flex items-center gap-3">
      {_renderReviewCardTitle(title, subtitle)}
    </div>
    <dl className="grid grid-cols-1 gap-x-8 text-xl sm:grid-cols-3 lg:text-lg">
      {entries}
    </dl>
  </div>
);

/**
 * Render customer review entries.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Customer entries.
 */
const _renderReviewCustomerEntries = (
  props: OrderCreateProps,
): React.ReactElement => (
  <>
    {_renderReviewEntry(
      "Customer",
      _getOptionNameOrDefault(props.customers, props.form.customer_id, "-"),
    )}
    {_renderReviewEntry("Name", props.form.customer_name || "-")}
    {_renderReviewEntry("Phone", props.form.customer_phone || "-")}
    {_renderReviewEntry("Address", props.form.address || "-", true)}
  </>
);

/**
 * Render handover review entries.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Handover entries.
 */
const _renderReviewHandoverEntries = (
  props: OrderCreateProps,
): React.ReactElement => (
  <>
    {_renderReviewEntry("ID Type", props.form.handover_type || "-")}
    {_renderReviewEntry("Owner", props.form.handover_name || "-")}
  </>
);

/**
 * Render order review entries.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Order entries.
 */
const _renderReviewOrderEntries = (
  props: OrderCreateProps,
): React.ReactElement => (
  <>
    {_renderReviewEntry(
      "PIC",
      _getOptionNameOrDefault(props.pics, props.form.pic_id, "-"),
    )}
    {_renderReviewEntry("Event", props.form.event_name || "-")}
    {_renderReviewEntry(
      "Order Type",
      _getOptionNameOrDefault(props.orderTypes, props.form.order_type_id, "-"),
    )}
    {_isHandoverOrderType(props) && _renderReviewHandoverEntries(props)}
    {_renderReviewEntry(
      "Service",
      _getOptionNameOrDefault(
        props.serviceTypes,
        props.form.service_type_id,
        props.form.service_type_name || "-",
      ),
    )}
    {props.form.voucher_id &&
      _renderReviewEntry(
        "Voucher",
        _getOptionNameOrDefault(props.vouchers, props.form.voucher_id, "-"),
      )}
    {_renderReviewEntry("Start", _formatReviewDate(props.form.start_at))}
    {_renderReviewEntry("End", _formatReviewDate(props.form.end_at), true)}
  </>
);

/**
 * Render a pricing breakdown entry.
 * @param {string} label - Pricing label.
 * @param {string} value - Formatted pricing value.
 * @returns {React.ReactElement} Pricing entry.
 */
const _renderPricingEntry = (
  label: string,
  value: string,
): React.ReactElement => (
  <div className="py-3 text-text-secondary">
    <span className="block text-lg text-text-secondary lg:text-lg">
      {label}
    </span>
    <span className="mt-1 block font-semibold text-text-primary">{value}</span>
  </div>
);

/**
 * Render grand total pricing entry.
 * @param {number} grandTotal - Grand total amount.
 * @returns {React.ReactElement} Grand total entry.
 */
const _renderGrandTotal = (grandTotal: number): React.ReactElement => (
  <div className="border-t border-border-default py-3 sm:border-l sm:border-t-0 sm:pl-4">
    <span className="block text-lg font-semibold text-action-primary lg:text-lg">
      Grand Total
    </span>
    <span className="mt-1 block text-3xl font-bold text-action-primary lg:text-lg">
      Rp {grandTotal.toLocaleString("id-ID")}
    </span>
  </div>
);

/**
 * Render pricing card header.
 * @returns {React.ReactElement} Pricing header.
 */
const _renderPricingHeader = (): React.ReactElement => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {_renderReviewCardTitle("Pricing", "Order cost breakdown")}
    </div>
    <span className="text-lg font-semibold uppercase tracking-wider text-text-secondary lg:text-lg">
      IDR
    </span>
  </div>
);

/**
 * Render review pricing card.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Pricing card.
 */
const _renderReviewPricing = (props: OrderCreateProps): React.ReactElement => {
  const totals = calculateOrderTotals(
    props.form.rental_transaction_items.filter((item) => item.item_id),
    props.form,
  );

  return (
    <div className="order-3 rounded-2xl bg-background-subtle p-5">
      {_renderPricingHeader()}
      <div className="grid gap-3 text-xl sm:grid-cols-2 lg:grid-cols-4 lg:text-lg">
        {_renderPricingEntry(
          "Subtotal",
          `Rp ${totals.subtotal.toLocaleString("id-ID")}`,
        )}
        {_renderPricingEntry(
          "Service Fee",
          `Rp ${props.form.service_fee.toLocaleString("id-ID")}`,
        )}
        {_renderPricingEntry(
          "Discount",
          `Rp ${totals.discountAmount.toLocaleString("id-ID")} (${props.form.discount}%)`,
        )}
        {_renderGrandTotal(totals.grandTotal)}
      </div>
    </div>
  );
};

/**
 * Render a reviewed item inside a project section.
 * Item prices are hidden; only the project header row shows its price.
 * @param {OrderProjectOption} project - Project option.
 * @param {OrderItemPayload} item - Project item row.
 * @returns {React.ReactElement} Project item row.
 */
const _renderReviewProjectItem = (
  project: OrderProjectOption,
  item: OrderItemPayload,
): React.ReactElement => {
  const isProjectHeader = item.item_id === project.id;

  return (
    <div
      key={`${project.id}-${item.item_id}`}
      className="grid gap-2 py-4 text-xl sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:text-lg"
    >
      <div className="min-w-0">
        <p className="break-words font-semibold text-text-primary">
          {item.item_name || item.item_id}
        </p>
        <p className="mt-1 text-lg text-text-secondary lg:text-lg">
          Qty {item.qty}
          {isProjectHeader && ` × Rp ${item.price.toLocaleString("id-ID")}`}
        </p>
        {item.remark && (
          <p className="mt-1 break-words text-lg text-text-secondary lg:text-lg">
            {item.remark}
          </p>
        )}
      </div>
      {isProjectHeader && (
        <p className="font-semibold text-text-primary sm:text-right">
          Rp {item.subtotal.toLocaleString("id-ID")}
        </p>
      )}
    </div>
  );
};

/**
 * Render a reviewed project section with its items.
 * @param {OrderCreateProps} props - Component properties.
 * @param {OrderProjectOption} project - Project option.
 * @returns {React.ReactElement} Project section.
 */
const _renderReviewProjectSection = (
  props: OrderCreateProps,
  project: OrderProjectOption,
): React.ReactElement => {
  const projectItems = props.form.rental_transaction_items.filter(
    (item) => item.project_id === project.id,
  );

  return (
    <section key={project.id} className="border-b border-border-default py-3">
      <div className="flex items-center justify-between gap-3 pb-2">
        <h4 className="text-xl font-semibold text-text-primary lg:text-lg">
          {project.name}
        </h4>
        <span className="shrink-0 text-lg font-semibold text-text-secondary lg:text-lg">
          {projectItems.length} items
        </span>
      </div>
      <div className="divide-y divide-border-default">
        {projectItems.map((item) => _renderReviewProjectItem(project, item))}
      </div>
    </section>
  );
};

/**
 * Render reviewed selected projects.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Project review list.
 */
const _renderReviewProjectList = (
  props: OrderCreateProps,
): React.ReactElement => {
  const selectedProjects = props.projects.filter((project) =>
    props.form.rental_transaction_items.some(
      (item) => item.project_id === project.id,
    ),
  );

  return (
    <div className="space-y-3">
      {selectedProjects.map((project) =>
        _renderReviewProjectSection(props, project),
      )}
    </div>
  );
};

/**
 * Render a reviewed rental item row.
 * @param {OrderItemPayload} item - Item row.
 * @returns {React.ReactElement} Item row.
 */
const _renderReviewPlainItem = (item: OrderItemPayload): React.ReactElement => (
  <div
    key={`${item.item_id}-${item.remark}`}
    className="flex items-start justify-between gap-3 border-b border-border-default py-3 text-xl lg:text-lg"
  >
    <span>
      {item.item_name}{" "}
      <span className="ml-2 text-text-secondary">Qty: {item.qty}</span>{" "}
      {item.remark && (
        <span className="ml-2 text-text-secondary">· {item.remark}</span>
      )}
    </span>
    <span className="font-semibold text-text-primary whitespace-nowrap">
      Rp {item.subtotal.toLocaleString("id-ID")}
    </span>
  </div>
);

/**
 * Render reviewed rental items.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Item review list.
 */
const _renderReviewPlainItemList = (
  props: OrderCreateProps,
): React.ReactElement => (
  <div className="space-y-2">
    {props.form.rental_transaction_items
      .filter((item) => item.item_id)
      .map((item) => _renderReviewPlainItem(item))}
  </div>
);

/**
 * Render review rental items card.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Rental items card.
 */
const _renderReviewItems = (props: OrderCreateProps): React.ReactElement => (
  <div className="order-2 rounded-2xl bg-background-subtle p-5">
    <h3 className="mb-3 text-2xl font-semibold text-text-primary lg:text-lg">
      Rental Items
    </h3>
    {_isProjectService(props.form)
      ? _renderReviewProjectList(props)
      : _renderReviewPlainItemList(props)}
  </div>
);

/**
 * Render review remarks textarea.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Remarks field.
 */
const _renderReviewRemarks = (props: OrderCreateProps): React.ReactElement => {
  /**
   * Handle remarks change.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - Textarea event.
   * @returns {void} Nothing.
   */
  const handleRemarks = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
    props.onChange("remarks", event.target.value);

  return (
    <label className="order-4 block space-y-2 rounded-2xl bg-background-subtle p-5">
      <span className="text-xl font-semibold text-text-secondary lg:text-lg">
        Remarks
      </span>
      <textarea
        value={props.form.remarks}
        onChange={handleRemarks}
        className="min-h-24 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-3 text-xl font-normal text-text-primary outline-none placeholder:font-normal placeholder:text-xl focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:text-lg lg:placeholder:text-lg"
      />
    </label>
  );
};

/**
 * Render review step.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Review step.
 */
const _renderReviewStep = (props: OrderCreateProps): React.ReactElement => (
  <section className="flex flex-col gap-6">
    <div className="order-1 grid grid-cols-1 gap-5">
      {_renderReviewCard(
        "Customer Information",
        "Contact and delivery details",
        _renderReviewCustomerEntries(props),
      )}
      {_renderReviewCard(
        "Order Information",
        "Schedule, type, and handover",
        _renderReviewOrderEntries(props),
      )}
    </div>
    {_renderReviewPricing(props)}
    {_renderReviewItems(props)}
    {_renderReviewRemarks(props)}
  </section>
);

/**
 * Render form error message.
 * @param {string} errorMessage - Error message.
 * @returns {React.ReactElement} Error alert.
 */
const _renderErrorMessage = (errorMessage: string): React.ReactElement => (
  <p role="alert" className="mt-4 text-lg font-medium text-danger">
    {errorMessage}
  </p>
);

/**
 * Render active step content and form error.
 * @param {OrderCreateProps} props - Component properties.
 * @returns {React.ReactElement} Step content.
 */
const _renderStepContent = (props: OrderCreateProps): React.ReactElement => (
  <div className="pb-6">
    {props.step === 1 && _renderInformationStep(props)}
    {props.step === 2 && _renderItemsStep(props)}
    {props.step === 3 && _renderReviewStep(props)}
    {props.errorMessage && _renderErrorMessage(props.errorMessage)}
  </div>
);

/**
 * Render submit button for the last step.
 * @param {OrderCreateProps} props - Component properties.
 * @param {string} submitLabel - Submit button label.
 * @returns {React.ReactElement} Submit button.
 */
const _renderSubmitButton = (
  props: OrderCreateProps,
  submitLabel: string,
): React.ReactElement => (
  <button
    disabled={props.isSubmitting}
    type="button"
    onClick={props.onSubmit}
    className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
  >
    {submitLabel}
  </button>
);

/**
 * Render next step button.
 * @param {() => void} onNextStep - Next step handler.
 * @returns {React.ReactElement} Next button.
 */
const _renderNextButton = (onNextStep: () => void): React.ReactElement => (
  <button
    type="button"
    onClick={onNextStep}
    className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary lg:text-lg"
  >
    Next
  </button>
);

/**
 * Render form navigation actions.
 * @param {OrderCreateProps} props - Component properties.
 * @param {string} submitLabel - Submit button label.
 * @returns {React.ReactElement} Form actions.
 */
const _renderFormActions = (
  props: OrderCreateProps,
  submitLabel: string,
): React.ReactElement => (
  <div className="mt-8 flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
    <button
      type="button"
      disabled={props.step === 1}
      onClick={props.onPreviousStep}
      className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
    >
      Back
    </button>
    {props.step === 3
      ? _renderSubmitButton(props, submitLabel)
      : _renderNextButton(props.onNextStep)}
  </div>
);

/**
 * Render Order Create form.
 * @param {OrderCreateProps} props - Form props
 * @returns {React.ReactElement} Order form
 */
export const OrderCreateComponent = (
  props: OrderCreateProps,
): React.ReactElement => {
  const pageTitle = props.isEdit ? "Edit Order" : "Create Order";
  const submitLabel = props.isSubmitting ? "Saving…" : pageTitle;

  return (
    <Layout pageTitle={pageTitle}>
      <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
        {_renderMobileBack(props.isEdit, props.onBack)}
        <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
          {_renderHeaderSection(pageTitle)}
          <form
            noValidate
            onSubmit={props.onPreventSubmit}
            className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-8 lg:rounded-3xl lg:p-10"
          >
            {_renderStepTabs(props)}
            {_renderStepContent(props)}
            {_renderFormActions(props, submitLabel)}
          </form>
          <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
        </div>
      </div>
    </Layout>
  );
};
