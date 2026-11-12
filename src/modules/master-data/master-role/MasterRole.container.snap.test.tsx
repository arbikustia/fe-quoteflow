import { MOCK_API_ROLES, MOCK_ROLE_LIST_RESPONSE } from "@/fixture/master-role";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetRolesQuery } from "@/services/master-role.service";

import MasterRoleContainer from "./MasterRole.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-role.service", () => ({ useGetRolesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_ROLE_LIST_RESPONSE, data: MOCK_API_ROLES.map((role) => ({ ...role, last_created: null })) };

describe("MasterRoleContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetRolesQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterRoleContainer, [{ desc: "should render the role list from query data", props: {} }]);
});
