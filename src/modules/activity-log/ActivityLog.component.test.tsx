import { MemoryRouter } from "react-router-dom";

import test, { fireEvent, render, screen } from "@/libs/unit-test";

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
      createdAt: "2026-11-01T07:01:19.094Z",
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

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-11-01T07:00:00.000Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

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

    expect(screen.getByRole("columnheader", { name: "No" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "User Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Action" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getAllByText("create")).toHaveLength(2);
  });

  it("should calculate correct row number on subsequent pages", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} currentPage={2} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("cell", { name: "11" })).toBeInTheDocument();
  });

  it("should render mobile card hierarchy matching quotation cards", () => {
    render(
      <MemoryRouter>
        <ActivityLogComponent {...mockProps} />
      </MemoryRouter>,
    );

    const desc = screen.getAllByText("Created Quotation Q-001")[0];
    const card = desc.closest("article");
    expect(card).toHaveClass("rounded-3xl", "border-border-strong", "bg-background-surface", "shadow-small");
    expect(desc).toHaveClass("text-xl");
    expect(card).toHaveTextContent("Logged at");
    expect(card).toHaveTextContent("User");
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
    expect(cards[0]).toHaveClass("rounded-3xl", "border-border-strong", "shadow-small");

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

it("ActivityLogComponent matches snapshot", () => {
  test.assertSnapshots(ActivityLogComponent, [
    { props: mockProps, desc: "renders with mock rows" },
    { props: { ...mockProps, isLoading: true, paginatedData: [] }, desc: "renders responsive skeletons" },
  ]);
});
