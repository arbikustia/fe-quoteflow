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

const _renderSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-customer"
    label="Customer"
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

const _renderPicSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-pic"
    label="PIC"
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

const _renderServiceTypeSelect = (
  props: OrderCreateProps,
): React.ReactElement => (
  <Select
    id="order-service-type"
    label="Service Type"
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

const _renderVoucherSelect = (props: OrderCreateProps): React.ReactElement => (
  <Select
    id="order-voucher"
    label="Voucher"
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

const _renderDateRange = (props: OrderCreateProps): React.ReactElement => {
  const handleStartDateChange = (value: string): void =>
    props.onChange("start_at", value);
  const handleEndDateChange = (value: string): void =>
    props.onChange("end_at", value);

  return (
    <DateRangePicker
      className="md:col-span-2"
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
    type?: "text" | "tel";
  },
): React.ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    props.onChange(config.field, event.target.value);
  const value = String(props.form[config.field]);
  const isInvalid = props.showInformationErrors && !value.trim();

  return (
    <InputComponent
      id={`order-${config.field}`}
      label={config.label}
      required
      value={value}
      onChange={handleChange}
      type={config.type ?? "text"}
      errorMessage={isInvalid ? `${config.label} is required` : undefined}
    />
  );
};

const _renderServiceFee = (props: OrderCreateProps): React.ReactElement => {
  const isInvalid = props.showInformationErrors && props.form.service_fee <= 0;
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
      required
      value={formattedValue}
      onChange={handleChange}
      inputMode="numeric"
      errorMessage={isInvalid ? "Service Fee is required" : undefined}
    />
  );
};

const _renderProjectCard = (
  props: OrderCreateProps,
  project: OrderCreateProps["projects"][number],
): React.ReactElement => {
  const isSelected = props.form.rental_transaction_items.some(
    (item) => item.project_id === project.id,
  );

  return (
    <button
      type="button"
      onClick={() => props.onToggleProject(project.id)}
      className={`flex min-h-24 w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${isSelected ? "border-action-primary bg-action-primary-subtle" : "border-border-default bg-background-surface"}`}
    >
      <span className="min-w-0 flex-1">
        <strong className="block whitespace-normal break-words text-sm font-semibold text-text-primary">
          {project.name}
        </strong>
        <small className="mt-1 block text-text-secondary">
          {project.items
            .map((item) => `${item.item_name ?? item.item_id} × ${item.qty}`)
            .join(", ") || "No items"}
        </small>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm ${isSelected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}
      >
        ✓
      </span>
    </button>
  );
};

const _renderItemCard = (
  props: OrderCreateProps,
  option: OrderCreateProps["items"][number],
): React.ReactElement => {
  const selected = props.form.rental_transaction_items.find(
    (item) => item.item_id === option.id,
  );
  const hasError = props.showItemErrors && !selected;
  let itemCardClass = "border-border-default bg-background-surface";

  if (selected) itemCardClass = "border-action-primary bg-action-primary-subtle";
  if (hasError) itemCardClass = "border-danger bg-background-surface";

  return (
    <div
      className={`relative min-h-24 rounded-2xl border p-4 transition-colors ${itemCardClass}`}
    >
      <button
        type="button"
        onClick={() => props.onToggleItem(option.id)}
        aria-label={`Select ${option.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
      />
      <div className="relative z-10 flex items-start gap-3 pointer-events-none">
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
          <strong className="block whitespace-normal break-words text-sm font-semibold text-text-primary">
            {option.name}
          </strong>
          <small className="mt-1 block text-text-secondary">
            Stock: {option.stock ?? 0} · Rp{" "}
            {(option.price ?? 0).toLocaleString("id-ID")}
          </small>
        </span>
        {selected && (
          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            <label
              htmlFor={`order-qty-${option.id}`}
              className="text-xs text-text-secondary"
            >
              Qty
            </label>
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
              className="w-20 rounded-lg border border-border-default bg-background-surface px-2 py-2 text-center text-sm"
            />
          </div>
        )}
        {selected && (
          <div className="pointer-events-auto ml-auto shrink-0">
            <label htmlFor={`order-remark-${option.id}`} className="sr-only">
              Remark
            </label>
            <textarea
              id={`order-remark-${option.id}`}
              value={selected.remark}
              onChange={(event) =>
                props.onItemChange(
                  props.form.rental_transaction_items.indexOf(selected),
                  "remark",
                  event.target.value,
                )
              }
              placeholder="Remark"
              rows={3}
              className="h-16 w-64 resize-none rounded-lg border border-border-default bg-background-surface px-3 py-2 text-sm"
            />
          </div>
        )}
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 self-start items-center justify-center rounded-full border text-sm ${selected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}
        >
          ✓
        </span>
      </div>
    </div>
  );
};

/* Item details are rendered inline in each Master Project-style card. */
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
const _getStepTextClass = (index: number, step: number, hasError: boolean): string => {
  if (hasError) return "text-danger";
  if (step === index + 1) return "text-action-primary";

  return "text-text-tertiary";
};

const _getStepBadgeClass = (index: number, step: number, hasError: boolean): string => {
  if (hasError) return "bg-danger text-text-inverse";
  if (step >= index + 1) return "bg-action-primary text-text-inverse";

  return "border border-border-default";
};

const _renderMobileBack = (onBack: () => void): React.ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden">
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
    <div className="my-6 pl-1">
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
  const handleAddress = (event: React.ChangeEvent<HTMLTextAreaElement>): void =>
    props.onChange("address", event.target.value);
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
  const isInformationStepError = props.showInformationErrors;
  const isItemsStepError = props.showItemErrors;

  return (
    <Layout pageTitle={pageTitle} mobileWhiteBackground>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(props.onBack)}
        <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0">
          {_renderHeaderSection(pageTitle, props.onBack)}
          <form
            noValidate
            onSubmit={props.onPreventSubmit}
            className="mb-10 flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs"
          >
            <div className="mb-6 flex items-center gap-2">
              {stepTitles.map((title, index) => (
                <React.Fragment key={title}>
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${_getStepTextClass(index, props.step, (index === 0 && isInformationStepError) || (index === 1 && isItemsStepError))}`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${_getStepBadgeClass(index, props.step, (index === 0 && isInformationStepError) || (index === 1 && isItemsStepError))}`}
                    >
                      {index + 1}
                    </span>
                    <span className="hidden sm:inline">{title}</span>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <span className="h-px flex-1 bg-border-default" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="pb-6">
              {props.step === 1 && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Order information
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {_renderSelect(props)}
                    {_renderField(props, {
                      field: "customer_name",
                      label: "Customer Name",
                    })}
                    {_renderField(props, {
                      field: "customer_phone",
                      label: "Customer Phone",
                    })}
                    {_renderPicSelect(props)}
                    {_renderDateRange(props)}
                    {_renderServiceTypeSelect(props)}
                    {_renderServiceFee(props)}
                    {_renderField(props, {
                      field: "event_name",
                      label: "Event Name",
                    })}
                    {_renderVoucherSelect(props)}
                  </div>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-text-secondary">
                      Address
                    </span>
                    <textarea
                      value={props.form.address}
                      onChange={handleAddress}
                      className="min-h-24 w-full rounded-xl border border-border-default bg-background-surface px-4 py-3"
                    />
                  </label>
                </section>
              )}
              {props.step === 2 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">
                      Select items
                    </h2>
                    <button
                      type="button"
                      onClick={props.onAddItem}
                      className="rounded-xl border border-action-primary px-4 py-2 text-sm font-semibold text-action-primary"
                    >
                      Add Item
                    </button>
                  </div>
                  {props.form.service_type_name.trim().toUpperCase() ===
                  "PROJECT" ? (
                    <div className="grid gap-4 md:grid-cols-2">
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
                      <div className="grid gap-4 md:grid-cols-2">
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
                <section className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Review Order
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Customer Information
                      </p>
                      <dl className="mt-2 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">Name:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.customer_name || "-"}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">Phone:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.customer_phone || "-"}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">Address:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.address || "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Order Information
                      </p>
                      <dl className="mt-2 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">PIC:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.pics.find(
                              (pic) => pic.id === props.form.pic_id,
                            )?.name || "-"}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">Event:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.event_name || "-"}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">Start:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.start_at || "-"}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-text-secondary">End:</dt>
                          <dd className="font-medium text-text-primary">
                            {props.form.end_at || "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Pricing
                      </p>
                      <p className="mt-1 text-text-primary">
                        Subtotal: Rp {totals.subtotal.toLocaleString("id-ID")}
                      </p>
                      <p className="text-text-primary">
                        Service Fee: Rp{" "}
                        {props.form.service_fee.toLocaleString("id-ID")}
                      </p>
                      <p className="text-text-primary">
                        Discount: Rp{" "}
                        {props.form.discount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-text-primary">
                        Grand Total: Rp{" "}
                        {totals.grandTotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold text-text-primary">
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
                          .map((project) => (
                            <section
                              key={project.id}
                              className="rounded-xl border border-border-default p-3"
                            >
                              <h4 className="font-semibold text-text-primary">
                                {project.name}
                              </h4>
                              <div className="mt-2 space-y-2">
                                {props.form.rental_transaction_items
                                  .filter(
                                    (item) => item.project_id === project.id,
                                  )
                                  .map((item) => (
                                    <div
                                      key={`${project.id}-${item.item_id}`}
                                      className="flex items-center justify-between text-sm"
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
                                      <span className="font-semibold text-text-primary">
                                        Rp{" "}
                                        {item.subtotal.toLocaleString("id-ID")}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </section>
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {props.form.rental_transaction_items
                          .filter((item) => item.item_id)
                          .map((item) => (
                            <div
                              key={`${item.item_id}-${item.remark}`}
                              className="flex items-center justify-between rounded-xl border border-border-default p-3 text-sm"
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
                              <span className="font-semibold text-text-primary">
                                Rp {item.subtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Remarks
                    </span>
                    <textarea
                      value={props.form.remarks}
                      onChange={handleRemarks}
                      className="min-h-24 w-full rounded-xl border border-border-default bg-background-surface px-4 py-3"
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
