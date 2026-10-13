import { render } from "@testing-library/react";
import MasterPicContainer from "./MasterPic.container";
import { BrowserRouter } from "react-router-dom";

jest.mock("./MasterPic.api", () => ({
  useGetPicsQuery: jest.fn(() => ({ data: undefined, error: undefined, isLoading: false })),
  useCreatePicMutation: jest.fn(),
  _mapPic: (pic: { id: string; name: string; status: number; created_at: string | null; created_by: string | null }) => ({
    id: pic.id,
    name: pic.name,
    status: pic.status === 1 ? "active" : "inactive",
    createAt: pic.created_at ?? "",
    createBy: pic.created_by ?? "",
  }),
}));

jest.mock("./MasterPic.component", () => ({
  MasterPicComponent: (props: any) => <div data-testid="master-pic-component" {...props} />
}));

describe("MasterPic Container", () => {
  it("should render component with correct props", () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <MasterPicContainer />
      </BrowserRouter>
    );

    expect(getByTestId("master-pic-component")).toBeDefined();
  });
});
