import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { MasterCustomerDetailComponent } from "./MasterCustomerDetail.component";
import { MOCK_CUSTOMERS } from "@/fixture/master-customer";

describe("MasterCustomerDetailComponent", () => {
  const mockCustomer = MOCK_CUSTOMERS[0];
  const defaultProps = {
    customer: mockCustomer,
    isMoreOpen: false,
    isDeleteModalOpen: false,
    goBack: jest.fn(),
    toggleMore: jest.fn(),
    closeMore: jest.fn(),
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    goEdit: jest.fn(),
    handleDelete: jest.fn(),
  };

  it("should render customer detail information correctly", () => {
    render(
      <BrowserRouter>
        <MasterCustomerDetailComponent {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockCustomer.name)).toBeTruthy();
    expect(screen.getByText(mockCustomer.id)).toBeTruthy();
    expect(screen.getByText(mockCustomer.phoneNumber ?? "")).toBeTruthy();
    expect(screen.getByText(mockCustomer.address ?? "")).toBeTruthy();
  });

  it("should render not found state when customer is null", () => {
    render(
      <BrowserRouter>
        <MasterCustomerDetailComponent {...defaultProps} customer={null} />
      </BrowserRouter>
    );

    expect(screen.getByText("Customer not found")).toBeTruthy();
  });

  it("should render delete modal when isDeleteModalOpen is true", () => {
    render(
      <BrowserRouter>
        <MasterCustomerDetailComponent {...defaultProps} isDeleteModalOpen={true} />
      </BrowserRouter>
    );

    expect(screen.getByText("Delete Customer?")).toBeTruthy();
  });

  it("should match snapshot for default state", () => {
    const { asFragment } = render(
      <BrowserRouter>
        <MasterCustomerDetailComponent {...defaultProps} />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
