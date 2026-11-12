import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { EMAIL_SENDER_FORM_DEFAULT_VALUES } from "./MasterEmailSenderCreate.config";
import { useMasterEmailSenderCreate } from "./MasterEmailSenderCreate.hook";
import type { EmailSenderFormValues, MasterEmailSenderCreateParams } from "./MasterEmailSenderCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: EmailSenderFormValues = {
  ...EMAIL_SENDER_FORM_DEFAULT_VALUES,
  name: "Finance Sender",
  email: "finance@company.com",
  smtpHost: "smtp.gmail.com",
  smtpUsername: "finance",
  smtpPassword: "secret",
};

/**
 * Build an input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const changeEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

/**
 * Build a form submit event.
 * @returns {SubmitEvent<HTMLFormElement>} - Submit event
 */
const submitEvent = (): SubmitEvent<HTMLFormElement> => ({ preventDefault: jest.fn(), persist: jest.fn() }) as never;

/**
 * Build a mutation trigger that resolves with the given response.
 * @param {MockMutationResponse} response - Mutation response
 * @returns {jest.Mock} - Mutation trigger
 */
const mutationOf = (response: MockMutationResponse): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<MockMutationResponse> => Promise.resolve(response) }));

/**
 * Build hook params.
 * @param {Partial<MasterEmailSenderCreateParams>} [overrides] - Params to override
 * @returns {MasterEmailSenderCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterEmailSenderCreateParams>): MasterEmailSenderCreateParams => ({
  mode: "create",
  initialValues: EMAIL_SENDER_FORM_DEFAULT_VALUES,
  createEmailSender: mutationOf({ status: true }),
  updateEmailSender: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterEmailSenderCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose field errors when empty, then clear them on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterEmailSenderCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Name is required.");
    expect(result.current.fieldErrors.smtpPassword).toBe("SMTP Password is required.");
    expect(params.createEmailSender).not.toHaveBeenCalled();

    act(() => result.current.handleTextChange.name(changeEvent("Finance")));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values.name).toBe("Finance");
  });

  it("should create the sender and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterEmailSenderCreate(params));

    act(() => {
      result.current.handleTextChange.name(changeEvent("Finance Sender"));
      result.current.handleTextChange.email(changeEvent("finance@company.com"));
      result.current.handleTextChange.smtpHost(changeEvent("smtp.gmail.com"));
      result.current.handleTextChange.smtpUsername(changeEvent("finance"));
      result.current.handleTextChange.smtpPassword(changeEvent("secret"));
      result.current.handlePortChange(465);
      result.current.handleToggleChange.isDefault(true);
    });
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createEmailSender).toHaveBeenCalledWith({
      name: "Finance Sender",
      email: "finance@company.com",
      smtp_host: "smtp.gmail.com",
      smtp_port: 465,
      smtp_username: "finance",
      smtp_password: "secret",
      enable_ssl: true,
      is_default: true,
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender", { state: { successMessage: "Email sender created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createEmailSender: mutationOf({ status: false, messages: ["Duplicate email"] }) });
    const { result } = renderHook(() => useMasterEmailSenderCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate email");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateEmailSender = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "sender-1", mode: "edit", initialValues: FILLED_VALUES, updateEmailSender });
    const { result } = renderHook(() => useMasterEmailSenderCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update email sender.");
  });

  it("should load edit values and submit the update without a new password", async () => {
    const params = createParams({ id: "sender-1", mode: "edit" });
    const { result, rerender } = renderHook((props: MasterEmailSenderCreateParams) => useMasterEmailSenderCreate(props), { initialProps: params });

    rerender({ ...params, initialValues: { ...FILLED_VALUES, smtpPassword: "" } });
    await waitFor(() => expect(result.current.values.name).toBe("Finance Sender"));

    act(() => result.current.handleToggleChange.isActive(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateEmailSender).toHaveBeenCalledWith(expect.objectContaining({ id: "sender-1", smtp_password: "", status: 0 }));
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender", { state: { successMessage: "Email sender updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterEmailSenderCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender");
  });
});
