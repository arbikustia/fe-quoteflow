import { fireEvent, render, screen } from "@testing-library/react";

import { MasterProjectComponent } from "./MasterProject.component";
import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

jest.mock("../../app/layout", () => ({
  __esModule: true,
  default: ({ children }: { readonly children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../app/shared/PageLayout", () => ({
  PageLayout: ({ children, headerRight, onBack }: { readonly children: React.ReactNode; readonly headerRight: React.ReactNode; readonly onBack: () => void }) => (
    <section>
      <button type="button" onClick={onBack}>Page Back</button>
      {headerRight}
      {children}
    </section>
  ),
}));

jest.mock("../../components/Pagination", () => ({ Pagination: () => <div data-testid="pagination" /> }));
jest.mock("../../components/Table", () => ({
  __esModule: true,
  default: ({ data, onRowClick }: { readonly data: readonly ProjectData[]; readonly onRowClick: (project: ProjectData) => void }) => (
    <button type="button" onClick={() => onRowClick(data[0])}>Desktop project row</button>
  ),
}));

const mockProject: ProjectData = {
  id: "1",
  name: "Website Revamp",
  items: [{ item_id: "ITM001", qty: 2 }],
  remark: "High priority",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

const createProps = (overrides: Partial<MasterProjectProps> = {}): MasterProjectProps => ({
  paginatedData: [mockProject],
  columns: [{ key: "name", header: "Project Name" }],
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  isMoreOpen: false,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
  ...overrides,
});

describe("MasterProjectComponent", () => {
  it("should render project data and forward actions", () => {
    const props = createProps();
    render(<MasterProjectComponent {...props} />);

    expect(screen.getByText("Website Revamp")).toBeInTheDocument();
    fireEvent.change(screen.getAllByRole("searchbox", { name: "Search project" })[0], { target: { value: "website" } });
    fireEvent.click(screen.getByText("Website Revamp").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: "Desktop project row" }));
    fireEvent.click(screen.getByRole("button", { name: "Create New" }));
    fireEvent.click(screen.getByRole("button", { name: "Page Back" }));

    expect(props.setSearchTerm).toHaveBeenCalledWith("website");
    expect(props.onEdit).toHaveBeenCalledWith(mockProject);
    expect(props.onRowClick).toHaveBeenCalledWith(mockProject);
    expect(props.onCreate).toHaveBeenCalled();
    expect(props.onBack).toHaveBeenCalled();
  });

  it.each([
    [{ isLoading: true }, "Loading projects…"],
    [{ isMissingData: true }, "Project data is unavailable. Please try again."],
    [{ errorMessage: "Unable to load projects." }, "Unable to load projects."],
    [{ isEmpty: true, paginatedData: [] }, "No projects found."],
  ])("should render list state", (overrides, message) => {
    render(<MasterProjectComponent {...createProps(overrides)} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should match project list snapshot", () => {
    const { asFragment } = render(<MasterProjectComponent {...createProps()} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
