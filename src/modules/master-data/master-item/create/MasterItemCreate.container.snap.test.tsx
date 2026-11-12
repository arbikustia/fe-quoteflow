import { useCategorySelectOptions } from "@/hooks/useCategorySelectOptions";
import test from "@/libs/unit-test";
import { useCreateItemMutation, useUpdateItemMutation, useUploadImageMutation } from "@/services/master-item.service";

import MasterItemCreateContainer from "./MasterItemCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/hooks/useCategorySelectOptions", () => ({ useCategorySelectOptions: jest.fn() }));
jest.mock("@/services/master-item.service", () => ({
  useCreateItemMutation: jest.fn(),
  useUpdateItemMutation: jest.fn(),
  useUploadImageMutation: jest.fn(),
}));

describe("MasterItemCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useCategorySelectOptions).mockReturnValue({ categories: [{ id: "category-1", category_name: "Lighting Equipment" }], isLoading: false, errorMessage: null });
    jest.mocked(useCreateItemMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateItemMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUploadImageMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterItemCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
