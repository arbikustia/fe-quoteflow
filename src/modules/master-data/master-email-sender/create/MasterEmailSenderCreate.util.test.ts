import { MOCK_API_EMAIL_SENDERS } from "@/fixture/master-email-sender";

import { EMAIL_SENDER_FORM_DEFAULT_VALUES } from "./MasterEmailSenderCreate.config";
import type { EmailSenderFormValues, EmailSenderValidValues } from "./MasterEmailSenderCreate.type";
import {
  buildEmailSenderPayload,
  createEmailSenderResolver,
  createTextChangeHandlers,
  createToggleChangeHandlers,
  formatApiMessages,
  getEmailSenderFieldErrors,
  normalizeEmailSenderFormSource,
  resolveEmailSenderForm,
  sendEmailSenderMutation,
} from "./MasterEmailSenderCreate.util";

const VALID_VALUES: EmailSenderValidValues = {
  name: "Finance Sender",
  email: "finance@company.com",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUsername: "finance",
  smtpPassword: "secret",
  enableSsl: true,
  isDefault: false,
  isActive: false,
};

const EXPECTED_PAYLOAD = {
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  smtp_password: "secret",
  enable_ssl: true,
  is_default: false,
  status: 0,
};

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterEmailSenderCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "email"])).toBe("Duplicate email");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Email sender request failed.");
  });

  it("should return loading, create and error sources without detail data", () => {
    expect(normalizeEmailSenderFormSource({ data: undefined, isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeEmailSenderFormSource({ data: undefined, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: EMAIL_SENDER_FORM_DEFAULT_VALUES,
    });
    expect(normalizeEmailSenderFormSource({ data: undefined, isLoading: false, isError: true }).formStatus).toBe("error");
  });

  it("should return an error source when the API reports a failure", () => {
    expect(normalizeEmailSenderFormSource({ data: { status: false, data: null, messages: ["Data not found."] }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should map the sender detail into form values with an empty password", () => {
    const source = normalizeEmailSenderFormSource({ data: { status: true, data: MOCK_API_EMAIL_SENDERS[1], messages: [] }, isLoading: false, isError: false });

    expect(source).toEqual({
      formStatus: "ready",
      initialValues: {
        name: "Support Sender",
        email: "support@company.com",
        smtpHost: "mail.company.com",
        smtpPort: 465,
        smtpUsername: "support",
        smtpPassword: "",
        enableSsl: false,
        isDefault: false,
        isActive: false,
      },
    });
  });

  it("should require the password only in create mode", () => {
    const values: EmailSenderFormValues = { ...VALID_VALUES, smtpPassword: " " };

    expect(resolveEmailSenderForm(values, "edit")).toEqual({ values: { ...values, name: "Finance Sender" }, errors: {} });
    expect(resolveEmailSenderForm(values, "create").errors).toEqual({
      smtpPassword: { type: "too_small", message: "SMTP Password is required." },
    });
  });

  it("should report the first error of every invalid field", () => {
    const result = resolveEmailSenderForm({ ...EMAIL_SENDER_FORM_DEFAULT_VALUES, email: "wrong", smtpPort: null }, "create");

    expect(getEmailSenderFieldErrors(result.errors)).toEqual({
      name: "Name is required.",
      email: "Email is not valid.",
      smtpHost: "SMTP Host is required.",
      smtpPort: "SMTP Port is required.",
      smtpUsername: "SMTP Username is required.",
      smtpPassword: "SMTP Password is required.",
    });
    expect(getEmailSenderFieldErrors(resolveEmailSenderForm({ ...VALID_VALUES, email: "", smtpPort: 70000 }, "edit").errors)).toEqual({
      email: "Email is required.",
      smtpPort: "SMTP Port must be between 1 and 65535.",
    });
  });

  it("should create a resolver bound to the form mode", () => {
    const resolver = createEmailSenderResolver("create");

    expect(resolver({ ...VALID_VALUES, smtpPassword: "" }, undefined, { fields: {}, shouldUseNativeValidation: false })).toMatchObject({ values: {} });
  });

  it("should build the request body with the status code", () => {
    expect(buildEmailSenderPayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildEmailSenderPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id, otherwise create", async () => {
    const createEmailSender = createMutation();
    const updateEmailSender = createMutation();

    await sendEmailSenderMutation(VALID_VALUES, { createEmailSender, updateEmailSender });
    await sendEmailSenderMutation(VALID_VALUES, { id: "sender-1", createEmailSender, updateEmailSender });

    expect(createEmailSender).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateEmailSender).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "sender-1" });
  });

  it("should create one handler per text and switch field", () => {
    const onFieldChange = jest.fn();
    const onToggle = jest.fn();
    const textHandlers = createTextChangeHandlers(onFieldChange);
    const toggleHandlers = createToggleChangeHandlers(onToggle);

    textHandlers.smtpHost({ target: { value: "smtp.gmail.com" } } as never);
    toggleHandlers.isDefault(true);

    expect(Object.keys(textHandlers)).toEqual(["name", "email", "smtpHost", "smtpUsername", "smtpPassword"]);
    expect(Object.keys(toggleHandlers)).toEqual(["enableSsl", "isDefault", "isActive"]);
    expect(onFieldChange).toHaveBeenCalledWith("smtpHost", "smtp.gmail.com");
    expect(onToggle).toHaveBeenCalledWith("isDefault", true);
  });
});
