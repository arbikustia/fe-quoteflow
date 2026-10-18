import { fireEvent, render, screen } from "@testing-library/react";

import { MobileList, MobileListCard } from "./MobileList.component";

describe("MobileList", () => {
  it("should render empty state", (): void => {
    render(<MobileList data={[]} emptyText="No records" />);

    expect(screen.getByText("No records")).toBeInTheDocument();
  });

  it("should render cards with text and fallback initial", (): void => {
    render(<MobileList data={[{ title: "Customer", subtitle: "Active" }]} />);

    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("should render image and badge", (): void => {
    render(
      <MobileListCard
        title="Item"
        imageUrl="/item.png"
        badge={<span>Available</span>}
      />,
    );

    expect(screen.getByRole("img", { name: "Item" })).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("should invoke card and edit handlers", (): void => {
    const onClick = jest.fn();
    const onEdit = jest.fn();
    render(<MobileListCard title="Item" onClick={onClick} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole("button", { name: "I Item" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
