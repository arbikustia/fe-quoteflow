import { MOCK_PROJECT_ITEMS_RESPONSE } from "@/fixture/master-project";
import test from "@/libs/unit-test";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

import MasterProjectCreateContainer from "./MasterProjectCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-item.service", () => ({ useGetAllItemsQuery: jest.fn() }));
jest.mock("@/services/master-project.service", () => ({
  useCreateProjectMutation: jest.fn(),
  useGetProjectByIdQuery: jest.fn(),
  useUpdateProjectMutation: jest.fn(),
}));

describe("MasterProjectCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetAllItemsQuery).mockReturnValue({ data: MOCK_PROJECT_ITEMS_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(useGetProjectByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateProjectMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateProjectMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterProjectCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
