import test from "@/libs/unit-test";
import { useCreatePicMutation, useUpdatePicMutation } from "@/services/master-pic.service";

import MasterPicCreateContainer from "./MasterPicCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-pic.service", () => ({
  useCreatePicMutation: jest.fn(),
  useUpdatePicMutation: jest.fn(),
}));

describe("MasterPicCreateContainer Snapshot Test", () => {
  beforeEach(() => {
    jest.mocked(useCreatePicMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdatePicMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  test.assertSnapshots(MasterPicCreateContainer, [{ desc: "should render the empty create form", props: {} }]);
});
