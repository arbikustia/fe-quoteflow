import { MOCK_API_CATEGORIES, MOCK_CATEGORY_LIST_RESPONSE } from "@/fixture/master-category";
import { usePagePermission } from "@/hooks/usePagePermission";
import test from "@/libs/unit-test";
import { useGetCategoriesQuery } from "@/services/master-category.service";

import MasterCategoryContainer from "./MasterCategory.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-category.service", () => ({ useGetCategoriesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

// Dates are rendered in the runner's timezone; null keeps the snapshot stable
const RESPONSE_WITHOUT_DATES = { ...MOCK_CATEGORY_LIST_RESPONSE, data: MOCK_API_CATEGORIES.map((category) => ({ ...category, created_at: null })) };

describe("MasterCategoryContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetCategoriesQuery).mockReturnValue({ data: RESPONSE_WITHOUT_DATES, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  test.assertSnapshots(MasterCategoryContainer, [{ desc: "should render the category list from query data", props: {} }]);
});
