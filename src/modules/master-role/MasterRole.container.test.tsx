import { render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import MasterRoleContainer from "./MasterRole.container";
import type { RoleData } from "./MasterRole.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-18T01:01:00+07:00"));
afterAll(() => jest.useRealTimers());

jest.mock("@/services/master-role.service", () => ({
  mapRole: (role: { id: string; role: string; last_created: string | null }) => ({
    id: role.id,
    roleName: role.role,
    status: "active",
    createAt: role.last_created ?? "",
    createBy: "",
  }),
  useGetRolesQuery: jest.fn(() => ({
    data: { data: [], total_pages: 0, total_count: 0, has_next: false, has_previous: false, page_number: 1 },
    error: undefined,
    isLoading: false,
  })),
  useCreateRoleMutation: jest.fn(),
}));

const mockRole: RoleData = {
  id: "1",
  roleName: "Admin",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

describe("MasterRoleContainer", () => {
  it("renders container component correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterRoleContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterRoleContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

