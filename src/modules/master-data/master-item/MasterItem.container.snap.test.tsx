import { MOCK_ITEM_LIST_RESPONSE } from "@/fixture/master-item";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetItemsQuery } from "@/services/master-item.service";

import MasterItemContainer from "./MasterItem.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-item.service", () => ({ useGetItemsQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

describe("MasterItemContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetItemsQuery).mockReturnValue({ data: MOCK_ITEM_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterItemContainer, [{ desc: "should render the item list from query data", props: {} }]);
});
