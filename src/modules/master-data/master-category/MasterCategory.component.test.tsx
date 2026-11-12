import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterCategoryComponent from "./MasterCategory.component";
import type { MasterCategoryProps } from "./MasterCategory.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const CATEGORY = { id: "1", categoryName: "Audio System", status: "active", createdAt: "01 Februari 2024" } as const;

/**
 * Build list view props.
 * @param {Partial<MasterCategoryProps>} [overrides] - Props to override
 * @returns {MasterCategoryProps} - Component props
 */
const createProps = (overrides?: Partial<MasterCategoryProps>): MasterCategoryProps => ({
  listStatus: "ready",
  categories: [CATEGORY],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  ...overrides,
});

describe("MasterCategoryComponent", () => {
  it("should render categories in the table and mobile cards", () => {
    render(<MasterCategoryComponent {...createProps()} />);

    expect(screen.getAllByText("Audio System")).toHaveLength(2);
    expect(screen.getAllByText("01 Februari 2024")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterCategoryComponent {...props} />);
    fireEvent.click(screen.getAllByText("Audio System")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit category" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterCategoryComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Category" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search category")[0], { target: { value: "audio" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterCategoryComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Category" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit category" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Audio System")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterCategoryComponent {...createProps({ listStatus: "loading", categories: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading category table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading category card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No categories found."],
    ["error", "Unable to load categories."],
    ["missing", "Category data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterCategoryComponent {...createProps({ listStatus, categories: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterCategoryComponent {...createProps({ successMessage: "Category created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Category created successfully.");
  });
});
