import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreatePicMutation, useUpdatePicMutation } from "@/services/master-pic.service";

import type { PicData } from "../MasterPic.type";

import MasterPicCreateContainer from "./MasterPicCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-pic.service", () => ({
  useCreatePicMutation: jest.fn(),
  useUpdatePicMutation: jest.fn(),
}));

const ROUTE_PIC: PicData = { id: "pic-1", name: "Aurora", status: "active", createdAt: "-" };

const updatePic = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} pathname - Initial route
 * @param {PicData} [pic] - PIC passed through router state
 * @returns {void}
 */
const renderAt = (pathname: string, pic?: PicData): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname, state: { pic } }]}>
      <Routes>
        <Route path="/master-pic" element={<p>PIC list</p>} />
        <Route path="/master-pic/create" element={<MasterPicCreateContainer />} />
        <Route path="/master-pic/edit/:id" element={<MasterPicCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterPicCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCreatePicMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdatePicMutation).mockReturnValue([updatePic, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-pic/create");

    expect(screen.getByRole("button", { name: "Create PIC" })).toBeInTheDocument();
  });

  it("should seed the form from router state and submit the update", async () => {
    renderAt("/master-pic/edit/pic-1", ROUTE_PIC);

    expect(screen.getByDisplayValue("Aurora")).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Update PIC" }));

    await waitFor(() => expect(screen.getByText("PIC list")).toBeInTheDocument());
    expect(updatePic).toHaveBeenCalledWith({ id: "pic-1", name: "Aurora", status: 1 });
  });

  it("should show the unavailable message when opened without router state", () => {
    renderAt("/master-pic/edit/pic-1");

    expect(screen.getByText("PIC data is unavailable. Open the PIC from the PIC list to edit it.")).toBeInTheDocument();
  });
});
