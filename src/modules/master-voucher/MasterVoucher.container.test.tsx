import type * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";
import { useGetVouchersQuery } from "@/services/master-voucher.service";

import MasterVoucherContainer from "./MasterVoucher.container";
import type { VoucherData } from "./MasterVoucher.type";

jest.mock("../../app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock("@/services/master-voucher.service", () => ({
  useGetVouchersQuery: jest.fn(),
  useCreateVoucherMutation: jest.fn(),
  mapVoucher: (voucher: { id: string; name: string; code: string; discount_percent: number; status: number; created_at: string | null }) => ({
    id: voucher.id,
    name: voucher.name,
    code: voucher.code,
    discountPercent: voucher.discount_percent,
    status: voucher.status === 1 ? "active" : "inactive",
    createAt: voucher.created_at ?? "",
    createBy: "",
  }),
}));

const mockUseGetVouchersQuery = useGetVouchersQuery as jest.Mock;

const mockVoucher: VoucherData = {
  id: "1",
  name: "Discount Voucher",
  code: "DISC10",
  discountPercent: 10,
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

describe("MasterVoucherContainer", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-18T01:30:00+07:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockUseGetVouchersQuery.mockReturnValue({
      data: {
        status: true,
        messages: null,
        data: [],
        page_number: 1,
        page_size: 10,
        total_pages: 1,
        total_count: 0,
        has_previous: false,
        has_next: false,
      },
      error: undefined,
      isLoading: false,
    });
  });

  it("should render container component correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterVoucherContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("should match snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterVoucherContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

