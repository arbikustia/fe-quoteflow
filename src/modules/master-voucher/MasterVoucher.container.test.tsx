import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getColumns } from "./MasterVoucher.columns";
import MasterVoucherContainer from "./MasterVoucher.container";
import { useGetVouchersQuery } from "./MasterVoucher.api";
import type { VoucherData } from "./MasterVoucher.type";

jest.mock("./MasterVoucher.api", () => ({
  useGetVouchersQuery: jest.fn(),
  useCreateVoucherMutation: jest.fn(),
  _mapVoucher: (voucher: { readonly id: string; readonly name: string; readonly code: string; readonly discount_percent: number; readonly status: number; readonly created_at: string | null }) => ({
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
  beforeEach(() => {
    mockUseGetVouchersQuery.mockReturnValue({
      data: {
        status: true,
        messages: null,
        data: {
          data: [],
          page_number: 1,
          total_pages: 1,
          total_count: 0,
          has_previous: false,
          has_next: false,
        },
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
    expect(columns).toHaveLength(6);
    expect(columns[0].key).toBe("no");
    expect(columns[1].key).toBe("code");
    expect(columns[2].key).toBe("discountPercent");
    expect(columns[3].key).toBe("status");
    expect(columns[4].key).toBe("createAt");
    expect(columns[5].key).toBe("actions");
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
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
      
      if (button) {
        fireEvent.click(button);
        expect(onEdit).toHaveBeenCalledWith(mockVoucher);
      }
    }
  });
});
