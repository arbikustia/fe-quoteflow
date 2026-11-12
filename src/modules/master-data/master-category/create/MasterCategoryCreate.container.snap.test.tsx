import test from "@/libs/unit-test";
import { useCreateCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/services/master-category.service";

import MasterCategoryCreateContainer from "./MasterCategoryCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-category.service", () => ({
  useGetCategoryByIdQuery: jest.fn(),
  useCreateCategoryMutation: jest.fn(),
  useUpdateCategoryMutation: jest.fn(),
}));

describe("MasterCategoryCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetCategoryByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateCategoryMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateCategoryMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterCategoryCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
