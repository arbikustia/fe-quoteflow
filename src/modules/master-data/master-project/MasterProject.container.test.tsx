import { MemoryRouter } from "react-router-dom";

import { MOCK_PROJECT_LIST_RESPONSE } from "@/fixture/master-project";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetProjectsQuery } from "@/services/master-project.service";

import MasterProjectContainer from "./MasterProject.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-project.service", () => ({ useGetProjectsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-project", state: { successMessage } }]}>
      <MasterProjectContainer />
    </MemoryRouter>,
  );
};

describe("MasterProjectContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetProjectsQuery).mockReturnValue({ data: MOCK_PROJECT_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized projects", () => {
    renderContainer();

    expect(useGetProjectsQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-project");
    expect(screen.getAllByText("Meeting Package")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Project" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit project/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Project updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Project updated successfully.");
  });
});
