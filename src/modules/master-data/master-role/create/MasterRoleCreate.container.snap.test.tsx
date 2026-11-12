import test from "@/libs/unit-test";
import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from "@/services/master-role.service";

import MasterRoleCreateContainer from "./MasterRoleCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-role.service", () => ({
  useGetRoleByIdQuery: jest.fn(),
  useCreateRoleMutation: jest.fn(),
  useUpdateRoleMutation: jest.fn(),
}));

describe("MasterRoleCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetRoleByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateRoleMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateRoleMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterRoleCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
