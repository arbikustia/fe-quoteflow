import { MOCK_API_PROJECTS, MOCK_PROJECT_LIST_RESPONSE } from "@/fixture/master-project";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetProjectsQuery } from "@/services/master-project.service";

import MasterProjectContainer from "./MasterProject.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-project.service", () => ({ useGetProjectsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_PROJECT_LIST_RESPONSE, data: MOCK_API_PROJECTS.map((project) => ({ ...project, created_at: null })) };

describe("MasterProjectContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetProjectsQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterProjectContainer, [{ desc: "should render the project list from query data", props: {} }]);
});
