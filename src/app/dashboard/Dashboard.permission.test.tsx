import { render, screen } from "@/libs/unit-test";
import { jest, describe, it, expect } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./index";
import { usePagePermission } from "@/hooks/usePagePermission";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn(),
}));

jest.mock("@/app/dashboard/Dashboard.hook", () => ({
  useDashboardAssets: jest.fn(() => ({ isLoading: false, voucherCount: 0 })),
  useDashboardNavigation: jest.fn(() => ({ navigateTo: jest.fn(), navigateToOrder: jest.fn() })),
  useDashboardOrders: jest.fn(() => ({ isLoading: false, isError: false, orders: [], chartData: [] })),
  useDashboardOverview: jest.fn(() => ({ isLoading: false, quotationCount: 0, invoiceCount: 0, paymentCount: 0, voucherCount: 0 })),
  useDashboardQuotations: jest.fn(() => ({ isLoading: false, calendarEvents: [] })),
}));

jest.mock("@/components/Sidebar/Sidebar.container", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar" />,
}));

describe("Dashboard permissions", () => {
  it("should show Master Data when one child page is allowed", () => {
    jest.mocked(usePagePermission).mockImplementation((url: string) => ({
      canView: url === "/master-customer",
      canCreate: false,
      canEdit: false,
      isSuperadmin: false,
    }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Master Data")).toBeInTheDocument();
  });

  it("should filter dashboard menu items based on permissions", () => {
    // Mock permissions: deny /document access
    (usePagePermission as jest.Mock).mockImplementation((url: string) => ({
      canView: url !== "/document",
      canCreate: true,
      canEdit: true,
      isSuperadmin: false,
    }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    // Check if 'Document' is not present
    expect(screen.queryByText("Document")).not.toBeInTheDocument();
    // Check if 'Create Order' is present
    expect(screen.getByText("Create Order")).toBeInTheDocument();
  });
});
