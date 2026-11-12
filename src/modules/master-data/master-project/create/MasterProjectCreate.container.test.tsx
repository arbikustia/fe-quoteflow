import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_PROJECT_DETAIL_RESPONSE, MOCK_PROJECT_ITEMS_RESPONSE } from "@/fixture/master-project";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

import MasterProjectCreateContainer from "./MasterProjectCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-item.service", () => ({ useGetAllItemsQuery: jest.fn() }));
jest.mock("@/services/master-project.service", () => ({
  useCreateProjectMutation: jest.fn(),
  useGetProjectByIdQuery: jest.fn(),
  useUpdateProjectMutation: jest.fn(),
}));

const updateProject = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @returns {void}
 */
const renderAt = (pathname: string): void => {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/master-project" element={<p>Project list</p>} />
        <Route path="/master-project/create" element={<MasterProjectCreateContainer />} />
        <Route path="/master-project/edit/:id" element={<MasterProjectCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterProjectCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetAllItemsQuery).mockReturnValue({ data: MOCK_PROJECT_ITEMS_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(useGetProjectByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateProjectMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateProjectMutation).mockReturnValue([updateProject, { isLoading: false }] as never);
  });

  it("should render an empty create form on the item step", () => {
    renderAt("/master-project/create");

    expect(useGetProjectByIdQuery).toHaveBeenCalledWith("", { skip: true });
    expect(screen.getByRole("button", { name: "Select Beam 290" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("should load the project in edit mode and submit the update", async () => {
    jest.mocked(useGetProjectByIdQuery).mockReturnValue({ data: MOCK_PROJECT_DETAIL_RESPONSE, isLoading: false, isError: false } as never);

    renderAt("/master-project/edit/project-1");

    expect(useGetProjectByIdQuery).toHaveBeenCalledWith("project-1", { skip: false });
    fireEvent.submit(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(screen.getByDisplayValue("Wedding Package")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Update Project" })).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Project" }));

    await waitFor(() => expect(screen.getByText("Project list")).toBeInTheDocument());
    expect(updateProject).toHaveBeenCalledWith(expect.objectContaining({ id: "project-1", name: "Wedding Package", price: 5000000, status: 1 }));
  });

  it("should show the load error when the project cannot be fetched", () => {
    jest.mocked(useGetProjectByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    renderAt("/master-project/edit/project-1");

    expect(screen.getByText("Unable to load project data. Please try again.")).toBeInTheDocument();
  });
});
