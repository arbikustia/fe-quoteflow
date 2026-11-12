import { MOCK_API_PICS, MOCK_PIC_LIST_RESPONSE } from "@/fixture/master-pic";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetPicsQuery } from "@/services/master-pic.service";

import MasterPicContainer from "./MasterPic.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-pic.service", () => ({ useGetPicsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_PIC_LIST_RESPONSE, data: MOCK_API_PICS.map((pic) => ({ ...pic, created_at: null })) };

describe("MasterPicContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetPicsQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterPicContainer, [{ desc: "should render the PIC list from query data", props: {} }]);
});
