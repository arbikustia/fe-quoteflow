import { BrowserRouter } from "react-router-dom";

import { MOCK_MAIL_FORM_PROPS } from "@/fixture/mail";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MailCreateForm } from "./MailCreate.component";
import type { MailComposeFormState } from "./MailCreate.type";

jest.mock("@/components/RichTextEditor", () => ({
  RichTextEditor: (): React.ReactElement => <div>Editor</div>,
}));

/**
 * Build form props with overrides.
 * @param {Partial<MailComposeFormState>} [overrides] - Prop overrides
 * @returns {MailComposeFormState} - Form props
 */
const buildProps = (overrides: Partial<MailComposeFormState> = {}): MailComposeFormState => ({
  ...MOCK_MAIL_FORM_PROPS,
  senderId: "",
  to: "",
  subject: "",
  body: "",
  attachmentName: "",
  attachmentUrl: "",
  ...overrides,
});

const renderForm = (props: MailComposeFormState): void => {
  render(
    <BrowserRouter>
      <MailCreateForm {...props} />
    </BrowserRouter>,
  );
};

describe("MailCreateForm", () => {
  it("should render every compose field", () => {
    renderForm(buildProps());

    expect(screen.getByLabelText(/From/)).toBeDefined();
    expect(screen.getByLabelText("Template", { exact: true })).toBeDefined();
    expect(screen.getByLabelText(/To/)).toBeDefined();
    expect(screen.getByLabelText(/Subject/)).toBeDefined();
    expect(screen.getByText("Editor")).toBeDefined();
    expect(screen.getByLabelText(/Quotation Attachment/)).toBeDefined();
  });

  it("should default the template select to the current template", () => {
    renderForm(buildProps({ template: "quotation" }));

    expect(screen.getByText("Quotation")).toBeDefined();
  });

  it("should render field errors", () => {
    renderForm(buildProps({ toError: "Recipient email is required.", bodyError: "Message body is required." }));

    expect(screen.getByText("Recipient email is required.")).toBeDefined();
    expect(screen.getByText("Message body is required.")).toBeDefined();
  });

  it("should call the recipient handler on input", () => {
    const handleToChange = jest.fn();

    renderForm(buildProps({ handleToChange }));

    fireEvent.change(screen.getByLabelText(/To/), { target: { value: "a@b.com" } });

    expect(handleToChange).toHaveBeenCalled();
  });

  it("should show the generated attachment preview", () => {
    renderForm(buildProps({ attachmentName: "Quotation-QUOT20261107151923.pdf", attachmentUrl: "blob:quotation-preview" }));

    expect(screen.getByText("Quotation-QUOT20261107151923.pdf")).toBeDefined();
    expect(screen.getByText("Open attachment").getAttribute("href")).toBe("blob:quotation-preview");
  });

  it("should disable the sender select while loading", () => {
    renderForm(buildProps({ isSenderLoading: true, senderOptions: [] }));

    expect(screen.getByText("Loading senders...")).toBeDefined();
  });

  it("should render the selected template preview", () => {
    renderForm(buildProps({ template: "quotation", body: "Hello" }));

    const preview = screen.getByTitle("Mail template preview");

    expect(preview).toBeDefined();
    expect(preview.getAttribute("srcdoc")).toContain("Penawaran Harga");
    expect(preview.getAttribute("srcdoc")).toContain("Hello");
  });

  it("should render the invoice template preview when invoice is selected", () => {
    renderForm(buildProps({ template: "invoice" }));

    const preview = screen.getByTitle("Mail template preview");

    expect(preview.getAttribute("srcdoc")).toContain(">Invoice<");
  });
});
