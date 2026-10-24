import { describe, expect, it, jest } from "@jest/globals";

import { render, screen } from "@/libs/unit-test";

import MasterCustomerCreateContainer from "./MasterCustomerCreate.container";
import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

jest.mock("./MasterCustomerCreate.hook", () => ({ useMasterCustomerCreate: jest.fn() }));
jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const formState: MasterCustomerCreateFormState = {
  name: "",
  address: "",
  phoneNumber: "",
  isActive: true,
  isEditMode: false,
  handleStatusChange: jest.fn(),
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handlePhoneNumberChange: jest.fn(),
  handleAddressChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

describe("MasterCustomerCreateContainer", (): void => {
  it("should render layout and customer form from hook state", (): void => {
    jest.mocked(useMasterCustomerCreate).mockReturnValue(formState);

    render(<MasterCustomerCreateContainer />);

    expect(screen.getByTestId("layout")).toBeTruthy();
    expect(screen.getByText("Customer Name")).toBeTruthy();
  });
});
