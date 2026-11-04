import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import DocumentMain from "./DocumentMain";
import { useDocumentIllustrationsLoaded } from "./DocumentMain.hook";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));

jest.mock("./DocumentMain.hook", () => ({
  useDocumentIllustrationsLoaded: jest.fn(() => false),
  useDocumentMobileViewport: jest.fn(() => false),
}));

describe("DocumentMain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render document card skeletons with rounded-3xl while illustrations load", () => {
    (useDocumentIllustrationsLoaded as jest.Mock).mockReturnValue(false);
    render(<MemoryRouter><DocumentMain /></MemoryRouter>);

    const skeletons = screen.getAllByRole("status", { name: "Loading document" });
    expect(skeletons).toHaveLength(3);
    expect(skeletons[0]).toHaveClass("rounded-3xl", "border-border-strong");
    expect(screen.getAllByTestId("document-card-skeleton-image")[0]).toHaveClass("rounded-3xl");
  });

  it("should render document cards with rounded-3xl and text-lg when loaded", () => {
    (useDocumentIllustrationsLoaded as jest.Mock).mockReturnValue(true);
    render(<MemoryRouter><DocumentMain /></MemoryRouter>);

    const quotationCard = screen.getByRole("button", { name: /Quotation/i });
    expect(quotationCard).toHaveClass("rounded-3xl", "border-border-strong", "bg-background-surface");
    expect(quotationCard.querySelectorAll(".text-xs, .text-sm, .text-base")).toHaveLength(0);

    fireEvent.click(quotationCard);
    expect(mockNavigate).toHaveBeenCalledWith("/document/quotation");
  });
});
