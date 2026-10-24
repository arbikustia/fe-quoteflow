import { render, screen } from "@testing-library/react";

import { SkeletonComponent } from "./Skeleton.component";

it("should render five default skeleton rows", (): void => {
  const { container } = render(<SkeletonComponent />);

  expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  expect(container.querySelectorAll(".ant-skeleton-input")).toHaveLength(18);
});

it("should render a dynamic table skeleton layout", (): void => {
  const { container } = render(<SkeletonComponent rows={2} columns={[{ width: "25%" }, { width: "75%" }]} />);

  expect(container.querySelectorAll(".ant-skeleton-input")).toHaveLength(6);
});
