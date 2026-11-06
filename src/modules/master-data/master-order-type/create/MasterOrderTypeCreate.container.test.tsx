import { describe, expect, it, jest } from "@jest/globals";

import { render, screen } from "@/libs/unit-test";

import MasterOrderTypeCreateContainer from "./MasterOrderTypeCreate.container";
import { useMasterOrderTypeCreate } from "./MasterOrderTypeCreate.hook";
import type { MasterOrderTypeCreateFormState } from "./MasterOrderTypeCreate.type";

jest.mock("./MasterOrderTypeCreate.hook", () => ({ useMasterOrderTypeCreate: jest.fn() }));
jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const formState: MasterOrderTypeCreateFormState = {
  name: "",
  isHandover: false,
  isActive: true,
  isEditMode: false,
  handleHandoverChange: jest.fn(),
  handleStatusChange: jest.fn(),
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

describe("MasterOrderTypeCreateContainer", (): void => {
  it("should render layout and order type form from hook state", (): void => {
    jest.mocked(useMasterOrderTypeCreate).mockReturnValue(formState);

    render(<MasterOrderTypeCreateContainer />);

    expect(screen.getByTestId("layout")).toBeTruthy();
    expect(screen.getByText("Order Type Name")).toBeTruthy();
  });
});
