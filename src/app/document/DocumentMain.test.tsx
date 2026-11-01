import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@/libs/unit-test";

import DocumentMain from "./DocumentMain";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => jest.fn(),
}));

jest.mock("./DocumentMain.hook", () => ({
  useDocumentIllustrationsLoaded: jest.fn(() => false),
  useDocumentMobileViewport: jest.fn(() => false),
}));

describe("DocumentMain", () => {
  it("should render document card skeletons while illustrations load", () => {
    render(<MemoryRouter><DocumentMain /></MemoryRouter>);

    expect(screen.getAllByRole("status", { name: "Loading document" })).toHaveLength(3);
    expect(screen.getAllByTestId("document-card-skeleton-image")).toHaveLength(3);
  });
});
