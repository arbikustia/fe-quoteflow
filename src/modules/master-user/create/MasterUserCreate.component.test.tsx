import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MasterUserCreateComponent } from "./MasterUserCreate.component";
import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

const createMockProps = (overrides?: Partial<MasterUserCreateFormState>): MasterUserCreateFormState => ({
  username: "johndoe",
  email: "john@example.com",
  password: "SecretPassword123!",
  isPasswordVisible: false,
  role: "User",
  roleOptions: [],
  roleOptionsLoading: false,
  roleOptionsError: null,
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  errorMessage: null,
  handleUsernameChange: jest.fn(),
  handleEmailChange: jest.fn(),
  handlePasswordChange: jest.fn(),
  handleTogglePasswordVisibility: jest.fn(),
  handleRoleChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async () => {}),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterUserCreateComponent", () => {
  it("renders password info text and password input as hidden by default", () => {
    const props = createMockProps();
    render(
      <MemoryRouter>
        <MasterUserCreateComponent {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText("Password harus terdiri dari minimal 11 karakter. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih aman.")).not.toBeNull();

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  it("renders password input as plain text when isPasswordVisible is true", () => {
    const props = createMockProps({ isPasswordVisible: true });
    render(
      <MemoryRouter>
        <MasterUserCreateComponent {...props} />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput.getAttribute("type")).toBe("text");
  });

  it("calls handleTogglePasswordVisibility when clicking toggle button", () => {
    const props = createMockProps();
    render(
      <MemoryRouter>
        <MasterUserCreateComponent {...props} />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole("button", { name: "Tampilkan kata sandi" });
    fireEvent.click(toggleButton);

    expect(props.handleTogglePasswordVisibility).toHaveBeenCalledTimes(1);
  });

  it("marks all create form fields as required", () => {
    render(
      <MemoryRouter>
        <MasterUserCreateComponent {...createMockProps()} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username/i).hasAttribute("required")).toBe(true);
    expect(screen.getByLabelText(/Email/i).hasAttribute("required")).toBe(true);
    expect(screen.getByLabelText(/^Password/i).hasAttribute("required")).toBe(true);
    expect(screen.getByRole("combobox", { name: /Role/i }).hasAttribute("required")).toBe(true);
  });

  it("renders role options returned by API", () => {
    render(
      <MemoryRouter>
        <MasterUserCreateComponent
          {...createMockProps({
            role: "kasir",
            roleOptions: [{ id: "role-kasir", role: "kasir", status: 0 }],
          })}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("option", { name: "kasir" }).getAttribute("value")).toBe("kasir");
  });
});
