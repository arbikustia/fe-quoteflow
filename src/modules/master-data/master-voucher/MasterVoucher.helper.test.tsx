import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createDownloadClickHandler,
  _createEditClickHandler,
  getVoucherColumns,
  getVoucherRowKey,
  renderVoucherMobileCard,
} from "./MasterVoucher.helper";
import type { VoucherData } from "./MasterVoucher.type";

const VOUCHER: VoucherData = {
  id: "voucher-1",
  name: "Summer Promo",
  code: "SLABC123",
  discountPercent: 10,
  status: "inactive",
  createdAt: "30 Oktober 2026 22:00",
};

describe("MasterVoucher helper", () => {
  it("should call edit and download without bubbling the click", () => {
    const onEdit = jest.fn();
    const onDownload = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(VOUCHER, onEdit)({ stopPropagation } as never);
    _createDownloadClickHandler(VOUCHER, onDownload)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(2);
    expect(onEdit).toHaveBeenCalledWith(VOUCHER);
    expect(onDownload).toHaveBeenCalledWith(VOUCHER);
  });

  it("should build columns with download and edit actions when allowed", () => {
    const actions = { canEdit: true, onEdit: jest.fn(), onDownload: jest.fn() };
    const columns = getVoucherColumns(2, 10, actions);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "code", "discountPercent", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(VOUCHER, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Summer Promo")).toBeInTheDocument();
    expect(screen.getByText("SLABC123")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Download voucher SLABC123" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit voucher SLABC123" }));
    expect(actions.onDownload).toHaveBeenCalledWith(VOUCHER);
    expect(actions.onEdit).toHaveBeenCalledWith(VOUCHER);
  });

  it("should keep only the download action without edit permission", () => {
    const columns = getVoucherColumns(1, 10, { canEdit: false, onEdit: jest.fn(), onDownload: jest.fn() });

    render(<div>{columns.at(-1)?.render?.(VOUCHER, 0)}</div>);

    expect(screen.getByRole("button", { name: "Download voucher SLABC123" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit voucher SLABC123" })).not.toBeInTheDocument();
  });

  it("should use the voucher id as the row key", () => {
    expect(getVoucherRowKey(VOUCHER)).toBe("voucher-1");
  });

  it("should render a mobile card with code and discount that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderVoucherMobileCard({ voucher: VOUCHER, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("SLABC123")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(VOUCHER);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderVoucherMobileCard({ voucher: VOUCHER, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
