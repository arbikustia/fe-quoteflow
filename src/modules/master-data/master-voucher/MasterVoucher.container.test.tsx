import { MemoryRouter } from "react-router-dom";

import { MOCK_VOUCHER_LIST_RESPONSE } from "@/fixture/master-voucher";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetVouchersQuery } from "@/services/master-voucher.service";

import MasterVoucherContainer from "./MasterVoucher.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-voucher.service", () => ({ useGetVouchersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-voucher", state: { successMessage } }]}>
      <MasterVoucherContainer />
    </MemoryRouter>,
  );
};

describe("MasterVoucherContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetVouchersQuery).mockReturnValue({ data: MOCK_VOUCHER_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized vouchers", () => {
    renderContainer();

    expect(useGetVouchersQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-voucher");
    expect(screen.getAllByText("WINTER25")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Voucher" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit voucher/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Voucher updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Voucher updated successfully.");
  });
});
