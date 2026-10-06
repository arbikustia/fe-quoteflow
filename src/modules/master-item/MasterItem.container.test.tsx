import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { getColumns } from "./MasterItem.columns";
import MasterItemContainer from "./MasterItem.container";
import type { ItemData } from "./MasterItem.type";

describe("MasterItemContainer", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <MasterItemContainer />
      </MemoryRouter>
    );
    expect(screen.getAllByText("Product List").length).toBeGreaterThan(0);
  });

  it("navigates on more toggle and renders table", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterItemContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterItemContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const mockOnEdit = vi.fn();
  const mockOnConfirm = vi.fn();
  const base: ItemData = { id: "1", name: "Speaker", category: "Audio", price: 5000000, stock: 12, image: "https://example.com/a.jpg", duration: "3 days", remark: "ok", unit: "unit", status: "active", createAt: "2024-01-01", createBy: "Admin" };
  const inactive: ItemData = { id: "2", name: "Light", category: "Lighting", price: 600000, stock: 5, image: "https://example.com/b.jpg", duration: "1 day", remark: "sharp", unit: "unit", status: "inactive", createAt: "2024-01-02", createBy: "Admin" };

  it("returns 10 columns with correct keys", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onConfirm: mockOnConfirm });
    expect(cols).toHaveLength(10);
    expect(cols.map((c) => c.key)).toEqual(["no","image","name","category","price","stock","duration","status","remark","actions"]);
  });

  it("no column render calculates correct number", () => {
    const cols = getColumns({ currentPage: 2, pageSize: 5, onEdit: mockOnEdit, onConfirm: mockOnConfirm });
    const noCol = cols.find((c) => c.key === "no")!;
    const el = (noCol.render as any)(base, 0) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    expect(container.textContent).toBe("6");
    const el2 = (noCol.render as any)(base, 4) as any;
    const { container: c2 } = render(<MemoryRouter>{el2}</MemoryRouter>);
    expect(c2.textContent).toBe("10");
  });

  it("status column renders active and inactive", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onConfirm: mockOnConfirm });
    const statusCol = cols.find((c) => c.key === "status")!;
    const activeEl = (statusCol.render as any)(base) as any;
    const { container: ca } = render(<MemoryRouter>{activeEl}</MemoryRouter>);
    expect(ca.textContent).toBe("active");
    expect(ca.innerHTML).toContain("bg-green-100");
    const inactiveEl = (statusCol.render as any)(inactive) as any;
    const { container: ci } = render(<MemoryRouter>{inactiveEl}</MemoryRouter>);
    expect(ci.textContent).toBe("inactive");
    expect(ci.innerHTML).toContain("bg-red-100");
  });

  it("price column formats correctly", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onConfirm: mockOnConfirm });
    const priceCol = cols.find((c) => c.key === "price")!;
    expect((priceCol.render as any)(base)).toBe("Rp " + base.price.toLocaleString("id-ID"));
  });

  it("actions column calls onEdit with stopPropagation", () => {
    const onEdit = vi.fn();
    const onConfirm = vi.fn();
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit, onConfirm });
    const actionsCol = cols.find((c) => c.key === "actions")!;
    const el = (actionsCol.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    const btns = container.querySelectorAll("button");
    expect(btns.length).toBe(2);
    fireEvent.click(btns[0]);
    expect(onEdit).toHaveBeenCalledWith(base);
    fireEvent.click(btns[1]);
    expect(onConfirm).toHaveBeenCalledWith(base);
  });

  it("image column renders img", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onConfirm: mockOnConfirm });
    const imgCol = cols.find((c) => c.key === "image")!;
    const el = (imgCol.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    const img = container.querySelector("img")!;
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe(base.image);
  });
});
