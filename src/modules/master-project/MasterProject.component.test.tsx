import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MasterProjectComponent } from "./MasterProject.component";
import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

jest.mock("../../components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

const mockProject: ProjectData = {
  id: "1",
  name: "Website Revamp",
  items: [{ itemId: "ITM001", qty: 2 }],
  remark: "High priority",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

const defaultProps: MasterProjectProps = {
  paginatedData: [mockProject],
  columns: [{ key: "name", header: "Project Name" }],
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  isMoreOpen: false,
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
};

describe("MasterProjectComponent", () => {
  const renderWithRouter = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <MasterProjectComponent {...props} />
      </MemoryRouter>
    );
  };

  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getAllByText("Project List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Website Revamp").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [], isEmpty: true, totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("No projects found.").length).toBeGreaterThan(0);
  });

  it("calls onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter({ ...defaultProps, onBack });
    const backBtn = screen.getByLabelText("Back");
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });



  it("matches snapshot", () => {
    const { asFragment } = renderWithRouter();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with empty data and closed menu", () => {
    const { asFragment } = renderWithRouter({ ...defaultProps, paginatedData: [] as ProjectData[], totalCount: 0, totalPages: 1, isMoreOpen: false });
    expect(asFragment()).toMatchSnapshot();
  });
});
