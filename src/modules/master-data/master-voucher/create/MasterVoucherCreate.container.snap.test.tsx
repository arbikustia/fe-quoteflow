import test from "@/libs/unit-test";
import { useCreateVoucherMutation, useGetVoucherByIdQuery, useUpdateVoucherMutation } from "@/services/master-voucher.service";

import MasterVoucherCreateContainer from "./MasterVoucherCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-voucher.service", () => ({
  useGetVoucherByIdQuery: jest.fn(),
  useCreateVoucherMutation: jest.fn(),
  useUpdateVoucherMutation: jest.fn(),
}));

describe("MasterVoucherCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetVoucherByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateVoucherMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateVoucherMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterVoucherCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
