import type { ChangeEvent, ReactElement } from "react";
import React from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { DatePicker } from "@/components/DatePicker";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type {
  PaymentCreateFormState,
  PaymentFieldErrors,
  PaymentFormFieldsConfig,
  PaymentHandlers,
  PaymentSelectFieldConfig,
} from "../Payment.type";

import {
  formatRupiahInput,
  getAmountLimitMessage,
  parseRupiahInput,
  PAYMENT_STATUS_OPTIONS,
} from "./PaymentCreate.helpers";

/**
 * Render mobile top back bar.
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Mobile header
 */
const _renderMobileBack = (
  isEditMode: boolean | undefined,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Payment" : "New Payment";
  const subtitle = "Manage document payments and status";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={goBack} />
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
};

/**
 * Render page header with breadcrumb.
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header section
 */
const _renderHeaderSection = (
  isEditMode: boolean | undefined,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Payment" : "New Payment";
  const subtitle = "Manage document payments and status";

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"
      >
        <button
          type="button"
          onClick={goBack}
          className="cursor-pointer hover:text-text-primary"
        >
          Payment
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {subtitle}
        </p>
      </div>
    </>
  );
};

/**
 * Render select form field.
 * @param {PaymentSelectFieldConfig} config - Select configuration
 * @returns {ReactElement} Select field
 */
const _renderSelectField = (config: PaymentSelectFieldConfig): ReactElement => (
  <Select
    id={config.id}
    label={config.label}
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
    placeholder={config.placeholder}
    value={config.value}
    options={config.options}
    onChange={config.onChange}
    required
    errorMessage={config.errorMessage ?? undefined}
  />
);

/**
 * Format transaction date for the summary.
 * @param {string} [value] - Date string
 * @returns {string} Formatted date or "-"
 */
const _formatSummaryDate = (value?: string): string => {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Render one transaction summary entry.
 * @param {string} label - Entry label
 * @param {string} value - Entry value
 * @param {boolean} [isEmphasized] - Highlight the value
 * @returns {ReactElement} Summary entry
 */
const _renderSummaryEntry = (label: string, value: string, isEmphasized = false): ReactElement => (
  <div className="min-w-0">
    <dt className="text-base text-text-secondary">{label}</dt>
    <dd className={`mt-1 break-words ${isEmphasized ? "text-xl font-semibold text-text-primary" : "text-lg font-medium text-text-primary"}`}>
      {value}
    </dd>
  </div>
);

/**
 * Render transaction summary of the selected invoice.
 * @param {PaymentCreateFormState} props - Form state
 * @returns {ReactElement | null} Transaction summary or null when no invoice selected
 */
const _renderTransactionSummary = (props: PaymentCreateFormState): ReactElement | null => {
  if (!props.selectedInvoice) return null;

  const transaction = props.selectedInvoice.quotation?.transaction;
  const startAt = _formatSummaryDate(transaction?.start_at);
  const endAt = _formatSummaryDate(transaction?.end_at);
  const eventDate = startAt === endAt ? startAt : `${startAt} - ${endAt}`;
  const grandTotal = props.grandTotal === null || props.grandTotal === undefined ? "-" : formatRupiahInput(String(props.grandTotal)) || "Rp 0";

  return (
    <section
      aria-label="Transaction summary"
      className="rounded-2xl bg-background-subtle p-5 lg:col-span-2"
    >
      <h3 className="mb-3 text-lg font-semibold text-text-primary">Transaction</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {_renderSummaryEntry("Customer", transaction?.customer_name || props.selectedInvoice.customer_name || "-")}
        {_renderSummaryEntry("Event Name", transaction?.event_name || props.selectedInvoice.event_name || "-")}
        {_renderSummaryEntry("Event Date", eventDate)}
        {_renderSummaryEntry("Grand Total", grandTotal, true)}
      </dl>
    </section>
  );
};

/**
 * Render amount input field.
 * @param {string} value - Formatted value
 * @param {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} onChange - Change handler
 * @param {string | null} errorMessage - Error message
 * @returns {ReactElement} Amount input
 */
const _renderAmountField = (
  value: string,
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  errorMessage: string | null,
): ReactElement => (
  <InputComponent
    id="payment-amount"
    type="text"
    label="Amount"
    placeholder="Rp 0"
    value={value}
    onChange={onChange}
    required
    className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
      errorMessage
        ? "[&_.ant-input]:!border-danger"
        : "[&_.ant-input]:!border-border-strong"
    } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
    errorMessage={errorMessage ?? undefined}
  />
);

/**
 * Render paid at date field.
 * @param {string} value - Date string
 * @param {(value: string) => void} onChange - Change handler
 * @param {string | null} errorMessage - Error message
 * @returns {ReactElement} Date picker field
 */
const _renderDateField = (
  value: string,
  onChange: (value: string) => void,
  errorMessage: string | null,
): ReactElement => (
  <DatePicker
    id="payment-paid-at"
    label="Paid At"
    value={value.slice(0, 10)}
    onChange={onChange}
    required
    className="!mb-0 [&_.ant-picker]:!h-16 lg:[&_.ant-picker]:!h-14 [&_.ant-picker]:!rounded-2xl [&_.ant-picker]:!border-2 [&_.ant-picker:not(.ant-picker-status-error)]:!border-border-strong [&_.ant-picker.ant-picker-status-error]:!border-danger [&_.ant-picker-input>input]:!text-xl lg:[&_.ant-picker-input>input]:!text-lg [&_.ant-picker-input>input]:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary"
    errorMessage={errorMessage ?? undefined}
    popupClassName="text-[11px] [&_.ant-picker-content]:text-[11px] [&_.ant-picker-cell-inner]:text-[11px]"
  />
);

/**
 * Render notes textarea field.
 * @param {string} value - Notes value
 * @param {(event: ChangeEvent<HTMLTextAreaElement>) => void} onChange - Change handler
 * @returns {ReactElement} Textarea element
 */
const _renderNotesField = (
  value: string,
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void,
): ReactElement => (
  <label className="block space-y-2 lg:col-span-2">
    <span className="text-lg font-normal text-text-primary lg:text-lg">
      Notes
    </span>
    <textarea
      id="payment-notes"
      value={value}
      onChange={onChange}
      placeholder="Enter notes"
      className="min-h-36 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:font-normal placeholder:text-xl placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg lg:placeholder:text-lg"
    />
  </label>
);

/**
 * Render status switch field (edit mode only).
 * @param {PaymentCreateFormState} props - Form state
 * @returns {ReactElement | null} Status switch element
 */
const _renderStatusField = (
  props: PaymentCreateFormState,
): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
            {props.isActive ? "active" : "inactive"}
          </span>
        </div>
        <span className="text-base text-text-secondary">
          Toggle active or inactive status
        </span>
      </div>
      <SwitchComponent
        id="payment-status"
        label="Payment status"
        checked={props.isActive ?? false}
        onChange={props.handleStatusChange}
      />
    </div>
  );
};

/**
 * Render main selects.
 * @param {PaymentFormFieldsConfig} config - Configuration
 * @returns {ReactElement} Selects element
 */
const _renderMainSelects = (
  config: PaymentFormFieldsConfig,
): ReactElement => {
  const { props, invoiceOptions, methodOptions, invoiceError, paymentMethodError, statusError } = config;
  const items: PaymentSelectFieldConfig[] = [
    { errorMessage: invoiceError, id: "payment-invoice", label: "Invoice", onChange: props.setInvoiceId, options: invoiceOptions, placeholder: "Select invoice", value: props.invoiceId },
    { errorMessage: paymentMethodError, id: "payment-method", label: "Payment Method", onChange: props.setPaymentMethodId, options: methodOptions, placeholder: "Select payment method", value: props.paymentMethodId },
    { errorMessage: statusError, id: "payment-status-select", label: "Payment Status", onChange: props.setStatus, options: PAYMENT_STATUS_OPTIONS, placeholder: "Select payment status", value: props.status },
  ];

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.id}>{_renderSelectField(item)}</React.Fragment>
      ))}
    </>
  );
};

/**
 * Render form fields grid.
 * @param {PaymentFormFieldsConfig} config - Form fields configuration
 * @returns {ReactElement} Form fields element
 */
const _renderFormFields = (config: PaymentFormFieldsConfig): ReactElement => (
  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
    {_renderMainSelects(config)}
    {_renderTransactionSummary(config.props)}
    {_renderAmountField(config.amountValue, config.handleAmountChange, config.amountError)}
    {_renderDateField(config.props.paidAt, config.handlePaidAt, config.paidAtError)}
    {_renderNotesField(config.props.notes, config.handleNotes)}
    {_renderStatusField(config.props)}
  </div>
);

/**
 * Render submit button section.
 * @param {boolean} isSubmitting - Submitting state
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Submit section
 */
const _renderSubmitSection = (
  isSubmitting: boolean,
  isEditMode: boolean | undefined,
  goBack: () => void,
): ReactElement => {
  const buttonText = isEditMode ? "Update Payment" : "Create Payment";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="button"
        onClick={goBack}
        className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Compute form field errors.
 * @param {PaymentCreateFormState} props - Form state
 * @returns {PaymentFieldErrors} Errors object
 */
const _getFormErrors = (
  props: PaymentCreateFormState,
): PaymentFieldErrors => ({
  amountError:
    props.isSubmitted && (!props.amount || props.amount <= 0)
      ? "Amount must be greater than Rp 0."
      : getAmountLimitMessage(props.amount, props.amountLimit),
  invoiceError:
    props.isSubmitted && !props.invoiceId ? "Invoice is required." : null,
  paidAtError:
    props.isSubmitted && !props.paidAt ? "Paid at is required." : null,
  paymentMethodError:
    props.isSubmitted && !props.paymentMethodId
      ? "Payment method is required."
      : null,
  statusError:
    props.isSubmitted && !props.status ? "Payment status is required." : null,
});

/**
 * Extract payment input change handlers.
 * @param {PaymentCreateFormState} props - Form state
 * @returns {PaymentHandlers} Handlers object
 */
const _getPaymentHandlers = (
  props: PaymentCreateFormState,
): PaymentHandlers => {
  /**
   * Update amount.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Input event
   * @returns {void} No return value
   */
  const handleAmountChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const digits = parseRupiahInput(event.target.value);

    props.setAmount(digits ? Number(digits) : null);
  };

  /**
   * Update notes.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Textarea event
   * @returns {void} No return value
   */
  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>): void =>
    props.setNotes(event.target.value);

  /**
   * Update paid at.
   * @param {string} value - Date string
   * @returns {void} No return value
   */
  const handlePaidAt = (value: string): void => props.setPaidAt(value);

  return { handleAmountChange, handleNotes, handlePaidAt };
};

/**
 * Build form fields configuration.
 * @param {PaymentCreateFormState} props - Form state
 * @param {PaymentHandlers} handlers - Handlers object
 * @returns {PaymentFormFieldsConfig} Config object
 */
const _buildFieldsConfig = (
  props: PaymentCreateFormState,
  handlers: PaymentHandlers,
): PaymentFormFieldsConfig => {
  const errors = _getFormErrors(props);
  const invoiceOptions = props.invoices.map((inv) => ({ label: inv.invoice_no, value: inv.id }));
  const methodOptions = props.paymentMethods.map((pm) => ({ label: pm.name, value: pm.id }));
  const amountValue = props.amount === null ? "" : formatRupiahInput(String(props.amount));

  return {
    ...errors,
    ...handlers,
    amountValue,
    invoiceOptions,
    methodOptions,
    props,
  };
};

/**
 * Render form card container.
 * @param {PaymentCreateFormState} props - Form state
 * @param {PaymentFormFieldsConfig} config - Config object
 * @returns {ReactElement} Form element
 */
const _renderFormCard = (
  props: PaymentCreateFormState,
  config: PaymentFormFieldsConfig,
): ReactElement => (
  <form
    noValidate
    onSubmit={props.handleSubmit}
    className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-5 lg:rounded-3xl lg:p-10"
  >
    <div className="pb-6">
      <section className="space-y-5">
        {_renderFormFields(config)}
      </section>
    </div>
    {_renderSubmitSection(props.isSubmitting, props.isEditMode, props.goBack)}
  </form>
);

/**
 * Render payment create form.
 * @param {PaymentCreateFormState} props - payment properties
 * @returns {ReactElement} payment form
 */
export const PaymentCreateComponent = (
  props: PaymentCreateFormState,
): ReactElement => {
  const handlers = _getPaymentHandlers(props);
  const fieldsConfig = _buildFieldsConfig(props, handlers);

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {props.errorMessage && (
        <AlertComponent
          type="error"
          message={props.errorMessage}
          toast
          closable
        />
      )}
      {_renderMobileBack(props.isEditMode, props.goBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
        {_renderHeaderSection(props.isEditMode, props.goBack)}
        {props.isLoadingOptions ? (
          <p className="py-12 text-center text-sm text-text-secondary">
            Loading payment options…
          </p>
        ) : (
          _renderFormCard(props, fieldsConfig)
        )}
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};
