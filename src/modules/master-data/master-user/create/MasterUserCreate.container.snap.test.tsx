import { MOCK_ROLE_ALL_RESPONSE } from "@/fixture/master-role";
import test from "@/libs/unit-test";
import { useGetAllRolesQuery } from "@/services/master-role.service";
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "@/services/master-user.service";

import MasterUserCreateContainer from "./MasterUserCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-user.service", () => ({
  useGetUserByIdQuery: jest.fn(),
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
}));
jest.mock("@/services/master-role.service", () => ({ useGetAllRolesQuery: jest.fn() }));

describe("MasterUserCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetUserByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useGetAllRolesQuery).mockReturnValue({ data: MOCK_ROLE_ALL_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(useCreateUserMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateUserMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterUserCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
