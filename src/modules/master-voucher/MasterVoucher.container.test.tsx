import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getColumns } from "./MasterVoucher.columns";
import MasterVoucherContainer from "./MasterVoucher.container";
import { useGetVouchersQuery } from "@/services/master-voucher.service";
import type { VoucherData } from "./MasterVoucher.type";

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

  it("renders container component correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterVoucherContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterVoucherContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const onEdit = jest.fn();
  const columns = getColumns({ currentPage: 1, pageSize: 10, onEdit });

  it("returns columns correctly", () => {
    expect(columns).toHaveLength(7);
    expect(columns[0].key).toBe("no");
    expect(columns[1].key).toBe("name");
    expect(columns[2].key).toBe("code");
    expect(columns[3].key).toBe("discountPercent");
    expect(columns[4].key).toBe("status");
    expect(columns[5].key).toBe("createAt");
    expect(columns[6].key).toBe("actions");
  });

  it("renders status column correctly", () => {
    const statusCol = columns.find((c) => c.key === "status");
    expect(statusCol).toBeDefined();
    
    if (statusCol?.render) {
      const activeRender = render(statusCol.render({ ...mockVoucher, status: "active" }, 0));
      expect(activeRender.container.textContent).toContain("active");
      
      const inactiveRender = render(statusCol.render({ ...mockVoucher, status: "inactive" }, 0));
      expect(inactiveRender.container.textContent).toContain("inactive");
    }
  });

  it("renders no column correctly", () => {
    const noCol = columns.find((c) => c.key === "no");
    expect(noCol).toBeDefined();

    if (noCol?.render) {
      const { container } = render(noCol.render(mockVoucher, 0));
      expect(container.textContent).toBe("1");
    }
  });

  it("renders actions column correctly", () => {
    const actionsCol = columns.find((c) => c.key === "actions");
    expect(actionsCol).toBeDefined();

    if (actionsCol?.render) {
      const { container } = render(actionsCol.render(mockVoucher, 0));
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBe(2);

      fireEvent.click(buttons[1]);
      expect(onEdit).toHaveBeenCalledWith(mockVoucher);
    }
  });
});
