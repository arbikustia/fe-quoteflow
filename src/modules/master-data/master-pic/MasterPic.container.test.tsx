import { MemoryRouter } from "react-router-dom";

import { MOCK_PIC_LIST_RESPONSE } from "@/fixture/master-pic";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetPicsQuery } from "@/services/master-pic.service";

import MasterPicContainer from "./MasterPic.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-pic.service", () => ({ useGetPicsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-pic", state: { successMessage } }]}>
      <MasterPicContainer />
    </MemoryRouter>,
  );
};

describe("MasterPicContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetPicsQuery).mockReturnValue({ data: MOCK_PIC_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized PICs", () => {
    renderContainer();

    expect(useGetPicsQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-pic");
    expect(screen.getAllByText("Kristofer")).toHaveLength(2);
    expect(screen.getAllByText("inactive")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create PIC" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit PIC/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("PIC updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("PIC updated successfully.");
  });
});
