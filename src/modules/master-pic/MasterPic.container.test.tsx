import { render } from "@testing-library/react";
import MasterPicContainer from "./MasterPic.container";
import { BrowserRouter } from "react-router-dom";

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
