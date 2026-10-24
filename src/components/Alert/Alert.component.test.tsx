import { render, screen } from "@/libs/unit-test";

import { AlertComponent } from "./Alert.component";

it("should render an Ant Design error alert", (): void => {
  render(<AlertComponent type="error" message="Unable to save customer." description="Try again." />);

  expect(screen.getByRole("alert")).toHaveTextContent("Unable to save customer.");
  expect(screen.getByText("Try again.")).toBeInTheDocument();
});

it("should close when closable alert is dismissed", (): void => {
  const onClose = jest.fn();
  render(<AlertComponent message="Saved" closable onClose={onClose} />);

  screen.getByRole("button", { name: "close" }).click();
  expect(onClose).toHaveBeenCalledTimes(1);
});

it("should render toast at top right", (): void => {
  render(<AlertComponent type="success" message="Customer created successfully." toast />);

  expect(screen.getByRole("alert").parentElement).toHaveClass("fixed", "right-4", "top-4");
});
