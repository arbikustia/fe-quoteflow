import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /** Render test layout content. */
  default: ({ children }: React.PropsWithChildren): React.ReactElement => <div>{children}</div>,
}));

import { ActivityLogComponent } from "./ActivityLog.component";
import type { ActivityLogProps } from "./ActivityLog.type";

const mockProps: ActivityLogProps = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  paginatedData: [
    {
      id: "act-1",
      userName: "John Doe",
      action: "create",
      page: "Quotation",
      description: "Created Quotation Q-001",
      createdAt: "2026-11-01T08:00:00",
    },
  ],
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onBack: jest.fn(),
};

describe("ActivityLogComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render desktop table with row number and action badge", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("columnheader", { name: "No" })).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "User Name" })).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "Action" })).not.toBeNull();
    expect(screen.getByRole("cell", { name: "1" })).not.toBeNull();
    expect(screen.getByRole("cell", { name: "John Doe" })).not.toBeNull();
    expect(screen.getAllByText("create")).toHaveLength(2);
  });

  it("should calculate correct row number on subsequent pages", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} currentPage={2} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("cell", { name: "11" })).not.toBeNull();
  });

  it("should render mobile card hierarchy matching quotation cards", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} />
      </MemoryRouter>,
    );

    const desc = screen.getAllByText("Created Quotation Q-001")[0];
    const card = desc.closest("article");
    expect(card?.className).toContain("rounded-3xl");
    expect(card?.className).toContain("shadow-small");
    expect(desc.className).toContain("text-xl");
    expect(card?.textContent).toContain("Logged at");
  });

  it("should trigger search callback when input changes", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} />
      </MemoryRouter>,
    );

    const searchInputs = screen.getAllByPlaceholderText("Search activity log");
    fireEvent.change(searchInputs[0], { target: { value: "Quotation" } });
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("Quotation");
  });

  it("should render card skeleton on mobile and table skeleton on desktop while loading", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} isLoading={true} paginatedData={[]} />
      </MemoryRouter>,
    );

    const cards = screen.getAllByRole("status", { name: "Loading activity log card" });
    expect(cards).toHaveLength(5);
    expect(cards[0].className).toContain("rounded-3xl");

    const table = screen.getByRole("status", { name: "Loading activity log table" });
    expect(table.querySelectorAll("thead th")).toHaveLength(6);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelectorAll("tbody tr:first-child td")).toHaveLength(6);
  });

  it("should render error message when provided", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} errorMessage="Network failure" />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Network failure")).toHaveLength(2);
  });

  it("should render empty state message when list is empty", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} isEmpty={true} paginatedData={[]} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("No activity logs found.")).toHaveLength(2);
  });
});
