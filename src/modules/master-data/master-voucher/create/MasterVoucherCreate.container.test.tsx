import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_VOUCHER_DETAIL_RESPONSE } from "@/fixture/master-voucher";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateVoucherMutation, useGetVoucherByIdQuery, useUpdateVoucherMutation } from "@/services/master-voucher.service";

import MasterVoucherCreateContainer from "./MasterVoucherCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-voucher.service", () => ({
  useGetVoucherByIdQuery: jest.fn(),
  useCreateVoucherMutation: jest.fn(),
  useUpdateVoucherMutation: jest.fn(),
}));

const updateVoucher = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @returns {void}
 */
const renderAt = (pathname: string): void => {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/master-voucher" element={<p>Voucher list</p>} />
        <Route path="/master-voucher/create" element={<MasterVoucherCreateContainer />} />
        <Route path="/master-voucher/edit/:id" element={<MasterVoucherCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterVoucherCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetVoucherByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateVoucherMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateVoucherMutation).mockReturnValue([updateVoucher, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-voucher/create");

    expect(screen.getByRole("button", { name: "Create Voucher" })).toBeInTheDocument();
  });

  it("should seed the form from the detail query and submit the update", async () => {
    jest.mocked(useGetVoucherByIdQuery).mockReturnValue({ data: MOCK_VOUCHER_DETAIL_RESPONSE, isLoading: false, isError: false } as never);
    renderAt("/master-voucher/edit/voucher-1");

    expect(useGetVoucherByIdQuery).toHaveBeenCalledWith("voucher-1", { skip: false });
    expect(screen.getByDisplayValue("Summer Promo")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Update Voucher" }));

    await waitFor(() => expect(screen.getByText("Voucher list")).toBeInTheDocument());
    expect(updateVoucher).toHaveBeenCalledWith({ id: "voucher-1", name: "Summer Promo", code: "SLABC123", discount_percent: 10, status: 1 });
  });

  it("should show the error message when the detail query fails", () => {
    jest.mocked(useGetVoucherByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);
    renderAt("/master-voucher/edit/voucher-1");

    expect(screen.getByText("Unable to load voucher data. Please try again.")).toBeInTheDocument();
  });
});
