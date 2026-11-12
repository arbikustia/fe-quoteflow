import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterPicComponent from "./MasterPic.component";
import type { MasterPicProps, PicData } from "./MasterPic.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const PIC: PicData = {
  id: "pic-1",
  name: "Aurora",
 
  status: "active",
  createdAt: "04 November 2026 20:57",
};

/**
 * Build list view props.
 * @param {Partial<MasterPicProps>} [overrides] - Props to override
 * @returns {MasterPicProps} - Component props
 */
const createProps = (overrides?: Partial<MasterPicProps>): MasterPicProps => ({
  listStatus: "ready",
  pics: [PIC],
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

describe("MasterPicComponent", () => {
  it("should render PICs in the table and mobile cards", () => {
    render(<MasterPicComponent {...createProps()} />);

    expect(screen.getAllByText("Aurora")).toHaveLength(2);
    expect(screen.getAllByText("04 November 2026 20:57")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterPicComponent {...props} />);
    fireEvent.click(screen.getAllByText("Aurora")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit PIC Aurora" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterPicComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create PIC" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search PIC")[0], { target: { value: "aurora" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterPicComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create PIC" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit PIC Aurora" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Aurora")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterPicComponent {...createProps({ listStatus: "loading", pics: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading PIC table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading PIC card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No PICs found."],
    ["error", "Unable to load PICs."],
    ["missing", "PIC data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterPicComponent {...createProps({ listStatus, pics: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterPicComponent {...createProps({ successMessage: "PIC created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("PIC created successfully.");
  });
});
