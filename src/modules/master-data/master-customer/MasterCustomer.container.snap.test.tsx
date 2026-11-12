import { MOCK_CUSTOMER_LIST_RESPONSE } from "@/fixture/master-customer";
import test from "@/libs/unit-test";
import { useGetCustomersQuery } from "@/services/master-customer.service";

import MasterCustomerContainer from "./MasterCustomer.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-customer.service", () => ({ useGetCustomersQuery: jest.fn() }));

describe("MasterCustomerContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetCustomersQuery).mockReturnValue({ data: MOCK_CUSTOMER_LIST_RESPONSE, isLoading: false, isError: false } as never);
  });

  test.assertSnapshots(MasterCustomerContainer, [{ desc: "should render the customer list from query data", props: {} }]);
});
