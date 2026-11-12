import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterProjectComponent from "./MasterProject.component";
import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const PROJECT: ProjectData = {
  id: "project-1",
  name: "Wedding Package",
  remark: "Full stage setup",
  status: "active",
  createdAt: "4 November 2026 19:49",
  itemCount: 1,
};

/**
 * Build list view props.
 * @param {Partial<MasterProjectProps>} [overrides] - Props to override
 * @returns {MasterProjectProps} - Component props
 */
const createProps = (overrides?: Partial<MasterProjectProps>): MasterProjectProps => ({
  listStatus: "ready",
  projects: [PROJECT],
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

describe("MasterProjectComponent", () => {
  it("should render projects in the table and mobile cards", () => {
    render(<MasterProjectComponent {...createProps()} />);

    expect(screen.getAllByText("Wedding Package")).toHaveLength(2);
    expect(screen.getAllByText("Full stage setup")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterProjectComponent {...props} />);
    fireEvent.click(screen.getAllByText("Wedding Package")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit project Wedding Package" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterProjectComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search project")[0], { target: { value: "wed" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterProjectComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryAllByRole("button", { name: "Create New" })).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Create Project" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit project Wedding Package" })).not.toBeInTheDocument();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterProjectComponent {...createProps({ listStatus: "loading", projects: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading project table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(6);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading project card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No projects found."],
    ["error", "Unable to load projects."],
    ["missing", "Project data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterProjectComponent {...createProps({ listStatus, projects: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterProjectComponent {...createProps({ successMessage: "Project created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Project created successfully.");
  });
});
