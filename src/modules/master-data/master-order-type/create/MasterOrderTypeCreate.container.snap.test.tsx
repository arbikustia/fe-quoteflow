import test from "@/libs/unit-test";
import { useCreateOrderTypeMutation, useGetOrderTypeByIdQuery, useUpdateOrderTypeMutation } from "@/services/master-order-type.service";

import MasterOrderTypeCreateContainer from "./MasterOrderTypeCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-order-type.service", () => ({
  useGetOrderTypeByIdQuery: jest.fn(),
  useCreateOrderTypeMutation: jest.fn(),
  useUpdateOrderTypeMutation: jest.fn(),
}));

describe("MasterOrderTypeCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetOrderTypeByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateOrderTypeMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateOrderTypeMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterOrderTypeCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
