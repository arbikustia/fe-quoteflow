import test from "@/libs/unit-test";
import { useCreateEmailSenderMutation, useGetEmailSenderByIdQuery, useUpdateEmailSenderMutation } from "@/services/email-sender.service";

import MasterEmailSenderCreateContainer from "./MasterEmailSenderCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/email-sender.service", () => ({
  useGetEmailSenderByIdQuery: jest.fn(),
  useCreateEmailSenderMutation: jest.fn(),
  useUpdateEmailSenderMutation: jest.fn(),
}));

describe("MasterEmailSenderCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useGetEmailSenderByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateEmailSenderMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateEmailSenderMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterEmailSenderCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
