import { MOCK_API_USERS, MOCK_USER_LIST_RESPONSE } from "@/fixture/master-user";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetUsersQuery } from "@/services/master-user.service";

import MasterUserContainer from "./MasterUser.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-user.service", () => ({ useGetUsersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_USER_LIST_RESPONSE, data: MOCK_API_USERS.map((user) => ({ ...user, last_created: null })) };

describe("MasterUserContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetUsersQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterUserContainer, [{ desc: "should render the user list from query data", props: {} }]);
});
