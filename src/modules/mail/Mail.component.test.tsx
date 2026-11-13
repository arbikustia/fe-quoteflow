import { BrowserRouter } from "react-router-dom";

import { MOCK_MAIL_PROPS } from "@/fixture/mail";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MailComponent } from "./Mail.component";
import type { MailProps } from "./Mail.type";

jest.mock("@/components/Pagination", () => ({
  Pagination: (): React.ReactElement => <div data-testid="pagination" />,
}));

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="mock-layout">{children}</div>);

/**
 * Render the mail component with optional prop overrides.
 * @param {Partial<MailProps>} [overrides] - Prop overrides
 * @returns {MailProps} - Props used for the render
 */
const renderComponent = (overrides: Partial<MailProps> = {}): MailProps => {
  const props = { ...MOCK_MAIL_PROPS, ...overrides };

  render(
    <BrowserRouter>
      <MailComponent {...props} />
    </BrowserRouter>,
  );

  return props;
};

describe("MailComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render mail rows", () => {
    renderComponent();

    expect(screen.getAllByText("Quotation follow up").length).toBeGreaterThan(0);
    expect(screen.getAllByText("customer@example.com").length).toBeGreaterThan(0);
  });

  it("should render empty state when no mails exist", () => {
    renderComponent({ paginatedData: [], isEmpty: true });

    expect(screen.getAllByText("No mails found.").length).toBeGreaterThan(0);
  });

  it("should render error state when the request fails", () => {
    renderComponent({ errorMessage: "Unable to load mails." });

    expect(screen.getAllByText("Unable to load mails.").length).toBeGreaterThan(0);
  });

  it("should render missing data state when the response has no data", () => {
    renderComponent({ isMissingData: true });

    expect(screen.getAllByText("Mail data is unavailable. Please try again.").length).toBeGreaterThan(0);
  });

  it("should render skeletons while loading", () => {
    renderComponent({ isLoading: true });

    expect(screen.getByLabelText("Loading mail table")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Loading mail card").length).toBeGreaterThan(0);
  });

  it("should call compose and search handlers", () => {
    const props = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Compose Mail" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search mail")[0], { target: { value: "quo" } });
    expect(props.onCompose).toHaveBeenCalled();
    expect(props.setSearchTerm).toHaveBeenCalledWith("quo");
  });
});
