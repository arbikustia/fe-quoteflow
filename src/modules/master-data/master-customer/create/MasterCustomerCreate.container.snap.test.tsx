import test from "@/libs/unit-test";
import { useCreateCustomerMutation, useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/services/master-customer.service";

import MasterCustomerCreateContainer from "./MasterCustomerCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-customer.service", () => ({
  useGetCustomerByIdQuery: jest.fn(),
  useCreateCustomerMutation: jest.fn(),
  useUpdateCustomerMutation: jest.fn(),
}));

describe("MasterCustomerCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetCustomerByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateCustomerMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateCustomerMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterCustomerCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
