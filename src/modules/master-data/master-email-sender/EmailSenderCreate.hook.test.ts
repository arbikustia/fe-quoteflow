import { act, renderHook } from "@/libs/unit-test";
import * as ReactRouterDom from "react-router-dom";

import { useEmailSenderCreate } from "./EmailSenderCreate.hook";
import type { EmailSender } from "./EmailSender.type";

import * as EmailSenderService from "@/services/email-sender.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/email-sender.service", () => ({
  useCreateEmailSenderMutation: jest.fn(),
  useUpdateEmailSenderMutation: jest.fn(),
}));

const mockSender: EmailSender = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  enable_ssl: true,
  is_default: true,
  status: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-02",
};

const mockNavigate = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

/**
 * Stub the router hooks for the given route.
 *
 * @param {{ id?: string; state: { emailSender?: EmailSender } | null }} route - Route stub
 * @returns {void} No return value
 */
const stubRoute = (route: { id?: string; state: { emailSender?: EmailSender } | null }): void => {
  jest.mocked(ReactRouterDom.useNavigate).mockReturnValue(mockNavigate);
  jest.mocked(ReactRouterDom.useParams).mockReturnValue(route.id ? { id: route.id } : {});
  jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
    hash: "",
    key: "default",
    pathname: "/master-email-sender/create",
    search: "",
    state: route.state,
  });
};

describe("useEmailSenderCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stubRoute({ state: null });
    (EmailSenderService.useCreateEmailSenderMutation as jest.Mock).mockReturnValue([mockCreate, { isLoading: false }]);
    (EmailSenderService.useUpdateEmailSenderMutation as jest.Mock).mockReturnValue([mockUpdate, { isLoading: false }]);
  });

  it("should start in create mode with default SMTP values", () => {
    const { result } = renderHook(() => useEmailSenderCreate());

    expect(result.current.isEditMode).toBe(false);
    expect(result.current.smtp_port).toBe(587);
    expect(result.current.enable_ssl).toBe(true);
    expect(result.current.is_default).toBe(false);
    expect(result.current.status).toBe(1);
  });

  it("should hydrate the form from the sender passed through route state", () => {
    stubRoute({ id: "sender-1", state: { emailSender: mockSender } });

    const { result } = renderHook(() => useEmailSenderCreate());

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.name).toBe("Finance Sender");
    expect(result.current.smtp_host).toBe("smtp.gmail.com");
    expect(result.current.smtp_password).toBe("");
  });

  it("should report field errors and skip the mutation when required fields are empty", () => {
    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.fieldErrors.name).toBe("Name is required.");
    expect(result.current.fieldErrors.email).toBe("Email is required.");
    expect(result.current.fieldErrors.smtp_password).toBe("SMTP Password is required.");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should not require a password when editing an existing sender", () => {
    stubRoute({ id: "sender-1", state: { emailSender: mockSender } });

    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.fieldErrors.smtp_password).toBeUndefined();
  });

  it("should create the sender and navigate to the list on success", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.resolve({ status: true }) });

    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => {
      result.current.onChange("name")({ target: { value: "Finance Sender" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("email")({ target: { value: "finance@company.com" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_host")({ target: { value: "smtp.gmail.com" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_username")({ target: { value: "finance" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_password")({ target: { value: "secret" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Finance Sender", email: "finance@company.com", status: 1 }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender", {
      state: { successMessage: "Email sender created successfully." },
    });
  });

  it("should update the sender in edit mode and expose the update success message", async () => {
    stubRoute({ id: "sender-1", state: { emailSender: mockSender } });
    mockUpdate.mockReturnValue({ unwrap: () => Promise.resolve({ status: true }) });

    const { result } = renderHook(() => useEmailSenderCreate());

    await act(async () => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: "sender-1", name: "Finance Sender" }));
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender", {
      state: { successMessage: "Email sender updated successfully." },
    });
  });

  it("should expose an error message when the mutation rejects", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.reject(new Error("boom")) });

    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => {
      result.current.onChange("name")({ target: { value: "Finance Sender" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("email")({ target: { value: "finance@company.com" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_host")({ target: { value: "smtp.gmail.com" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_username")({ target: { value: "finance" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.onChange("smtp_password")({ target: { value: "secret" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.errorMessage).toBe("Unable to create email sender.");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should toggle the SSL, default and status switches", () => {
    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => result.current.onSslChange(false));
    expect(result.current.enable_ssl).toBe(false);

    act(() => result.current.onDefaultChange(true));
    expect(result.current.is_default).toBe(true);

    act(() => result.current.onStatusChange(false));
    expect(result.current.status).toBe(0);
  });

  it("should clear field errors after a field changes", () => {
    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => {
      result.current.onSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });
    expect(result.current.fieldErrors.name).toBe("Name is required.");

    act(() => {
      result.current.onChange("name")({ target: { value: "Finance Sender" } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fieldErrors).toEqual({});
  });

  it("should navigate back to the sender list", () => {
    const { result } = renderHook(() => useEmailSenderCreate());

    act(() => result.current.onBack());

    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender");
  });
});
