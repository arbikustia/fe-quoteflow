import type { ReactElement } from "react";
import { FiFileText, FiX } from "react-icons/fi";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Select } from "@/components/Select";

import { buildMailHtmlTemplate } from "@/services/mail/mail.service";

import type { MailComposeFormState, MailTextFieldConfig } from "./MailCreate.type";

/**
 * Render standard text input field.
 * @param {MailTextFieldConfig} config - Input configuration
 * @returns {ReactElement} Field element
 */
const _renderInputField = (config: MailTextFieldConfig): ReactElement => (
  <InputComponent
    id={config.id}
    type={config.type ?? "text"}
    label={config.label}
    placeholder={config.placeholder}
    value={config.value}
    required={config.required}
    onChange={config.onChange}
    className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
      config.errorMessage ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"
    } [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
    errorMessage={config.errorMessage ?? undefined}
  />
);

/**
 * Render the From sender select.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Sender select
 */
const _renderSenderField = (props: MailComposeFormState): ReactElement => (
  <div>
    <Select
      id="mail-sender"
      label="From"
      labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
      className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
      selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
      required={true}
      value={props.senderId}
      disabled={props.isSenderLoading}
      placeholder={props.isSenderLoading ? "Loading senders..." : "Select sender"}
      options={props.senderOptions}
      onChange={props.handleSenderChange}
      errorMessage={props.senderError}
    />
  </div>
);

/**
 * Render the template select.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Template select
 */
const _renderTemplateField = (props: MailComposeFormState): ReactElement => (
  <div>
    <Select
      id="mail-template"
      label="Template"
      labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
      className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
      selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
      required={true}
      value={props.template}
      placeholder="Select template"
      options={props.templateOptions}
      onChange={props.handleTemplateChange}
    />
  </div>
);

/**
 * Render the quotation select.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Quotation select
 */
const _renderQuotationField = (props: MailComposeFormState): ReactElement => (
  <div className="space-y-3 pb-2 lg:col-span-2">
    <Select
      id="mail-quotation"
      label="Quotation Attachment"
      labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
      className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
      selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
      required={true}
      value={props.quotationId}
      placeholder="Select quotation to attach"
      options={props.quotationOptions}
      onChange={props.handleQuotationChange}
      errorMessage={props.attachmentError}
    />
    {props.attachmentName && _renderAttachmentPreview(props)}
  </div>
);

/**
 * Render the invoice select used by the invoice template.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Invoice select
 */
const _renderInvoiceField = (props: MailComposeFormState): ReactElement => (
  <div className="space-y-3 pb-2 lg:col-span-2">
    <Select
      id="mail-invoice"
      label="Invoice Attachment"
      labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
      className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
      selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
      required={true}
      value={props.invoiceId}
      placeholder="Select invoice to attach"
      options={props.invoiceOptions}
      onChange={props.handleInvoiceChange}
      errorMessage={props.attachmentError}
    />
    {props.attachmentName && _renderAttachmentPreview(props)}
  </div>
);

/**
 * Render the To recipient field.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Recipient field
 */
const _renderToField = (props: MailComposeFormState): ReactElement =>
  _renderInputField({
    errorMessage: props.toError,
    id: "mail-to",
    label: "To",
    onChange: props.handleToChange,
    placeholder: "e.g. customer@example.com",
    required: true,
    type: "email",
    value: props.to,
  });

/**
 * Render the subject field.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Subject field
 */
const _renderSubjectField = (props: MailComposeFormState): ReactElement =>
  _renderInputField({
    errorMessage: props.subjectError,
    id: "mail-subject",
    label: "Subject",
    onChange: props.handleSubjectChange,
    placeholder: "e.g. Quotation follow up",
    required: true,
    value: props.subject,
  });

/**
 * Render the body textarea.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Body field
 */
const _renderBodyField = (props: MailComposeFormState): ReactElement => (
  <div className="space-y-2 lg:col-span-2">
    <span className="text-lg font-normal text-text-primary">
      Body
      <span aria-hidden="true" className="ml-1 text-danger">
        *
      </span>
    </span>
    <div id="mail-body">
      <RichTextEditor value={props.body} onChange={props.handleBodyChange} placeholder="Write the mail content" />
    </div>
    {props.bodyError && (
      <p role="alert" className="mt-1.5 text-sm text-danger">
        {props.bodyError}
      </p>
    )}
  </div>
);

/**
 * Render the selected PDF attachment preview.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Attachment card
 */
const _renderAttachmentPreview = (props: MailComposeFormState): ReactElement => (
  <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border-2 border-action-primary/40 bg-action-primary-subtle px-4 py-3">
    <div className="flex min-w-0 items-center gap-3">
      <FiFileText aria-hidden="true" className="h-8 w-8 shrink-0 text-action-primary" />
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold text-text-primary">{props.attachmentName}</p>
        <a
          href={props.attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-action-primary underline underline-offset-2 hover:text-action-primary-hover"
        >
          Open attachment
        </a>
      </div>
    </div>
    <button
      type="button"
      onClick={props.handleAttachmentRemove}
      disabled={props.isSubmitting}
      aria-label="Remove attachment"
      className="shrink-0 cursor-pointer rounded-xl p-2 text-text-secondary transition-colors hover:bg-danger-subtle hover:text-danger-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiX className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Render the PDF attachment field.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Attachment field
 */
const _renderAttachmentField = (props: MailComposeFormState): ReactElement => (
  <div className="space-y-2 lg:col-span-2">
    <label htmlFor="mail-attachment" className="block text-lg font-normal text-text-primary">
      Attachment
    </label>
    <input
      id="mail-attachment"
      type="file"
      accept="application/pdf"
      onChange={props.handleAttachmentChange}
      disabled={props.isSubmitting}
      className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-border-strong bg-background-surface px-4 py-4 text-lg font-normal text-text-secondary outline-none file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-action-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text-inverse hover:border-action-primary hover:file:bg-action-primary-hover focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-focus-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
    />
    {props.attachmentName && _renderAttachmentPreview(props)}
    {props.attachmentError && (
      <p role="alert" className="text-sm text-danger">
        {props.attachmentError}
      </p>
    )}
  </div>
);

/**
 * Render submit and cancel actions.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Action section
 */
const _renderSubmitSection = (props: MailComposeFormState): ReactElement => (
  <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5">
    <button
      type="button"
      onClick={props.goBack}
      disabled={props.isSubmitting}
      className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={props.isSubmitting}
      className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {props.isSubmitting ? "Sending…" : "Send Mail"}
    </button>
  </div>
);

/**
 * Render the mobile back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <BackButton onClick={goBack} />
    <div className="min-w-0">
      <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">New Mail</h2>
      <p className="mt-1 truncate text-sm text-text-secondary">Fill in the mail details below.</p>
    </div>
  </div>
);

/**
 * Render the desktop page header.
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (): ReactElement => (
  <div className="hidden lg:block">
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
      <span>Mail</span>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">New Mail</span>
    </nav>
    <div className="mb-6">
      <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">New Mail</h2>
      <p className="mt-2 text-sm text-text-secondary">Fill in the mail details below.</p>
    </div>
  </div>
);

/**
 * Render the selected mail template preview.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Template preview
 */
const _renderTemplatePreview = (props: MailComposeFormState): ReactElement => (
  <section
    className="min-w-0 rounded-3xl border border-border-default bg-background-surface p-4 shadow-small lg:sticky lg:top-6 lg:h-fit"
    aria-labelledby="mail-template-preview-title"
  >
    <h3 id="mail-template-preview-title" className="mb-4 text-lg font-semibold text-text-primary">
      Template preview
    </h3>
    <iframe
      title="Mail template preview"
      srcDoc={buildMailHtmlTemplate(props.body, props.template, props.selectedQuotation, props.selectedInvoice)}
      sandbox=""
      className="h-[560px] w-full rounded-2xl border border-border-default bg-white lg:h-[720px]"
    />
  </section>
);

/**
 * Render the compose form card.
 * @param {MailComposeFormState} props - Form state
 * @returns {ReactElement} Form card
 */
const _renderFormCard = (props: MailComposeFormState): ReactElement => (
  <form noValidate onSubmit={props.handleSubmit} className="flex min-w-0 flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
    <div className="pb-6">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        {_renderSenderField(props)}
        {_renderTemplateField(props)}
        {_renderToField(props)}
        {_renderSubjectField(props)}
        {props.template === "invoice" ? _renderInvoiceField(props) : _renderQuotationField(props)}
        {_renderBodyField(props)}
      </div>
    </div>
    {_renderSubmitSection(props)}
  </form>
);

/**
 * Mail compose form.
 * @param {MailComposeFormState} props - Form props
 * @returns {ReactElement} Mail form
 */
export const MailCreateForm = (props: MailComposeFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
      {_renderHeaderSection()}
      <div className="flex flex-col gap-6 lg:-mt-4 lg:mb-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="min-w-0 lg:col-span-4">{_renderTemplatePreview(props)}</div>
        <div className="min-w-0 lg:col-span-8">{_renderFormCard(props)}</div>
      </div>
    </div>
  </div>
);
