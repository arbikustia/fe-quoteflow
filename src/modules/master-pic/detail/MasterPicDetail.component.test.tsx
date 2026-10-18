import test from "../../../libs/unit-test";
import type { PicData } from "../MasterPic.type";
import { MasterPicDetailComponent } from "./MasterPicDetail.component";
import type { MasterPicDetailState } from "./MasterPicDetail.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

describe("MasterPicDetailComponent", () => {
  const mockPic: PicData = {
    id: "1",
    name: "John Doe",
    status: "active",
    createAt: "2024-01-01",
    createBy: "Admin",
  };

  const baseProps: MasterPicDetailState = {
    pic: mockPic,
    isMoreOpen: false,
    isDeleteModalOpen: false,
    goBack: jest.fn(),
    toggleMore: jest.fn(),
    closeMore: jest.fn(),
    goEdit: jest.fn(),
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    handleDelete: jest.fn(async () => {}),
  };

  test.assertSnapshots(MasterPicDetailComponent, [
    {
      props: baseProps,
      desc: "default detail view",
    },
    {
      props: { ...baseProps, isMoreOpen: true },
      desc: "more menu open",
    },
    {
      props: { ...baseProps, isDeleteModalOpen: true },
      desc: "delete modal open",
    },
    {
      props: { ...baseProps, pic: null },
      desc: "pic not found view",
    },
  ]);
});
