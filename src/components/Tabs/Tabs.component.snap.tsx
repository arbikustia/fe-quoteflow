import { render } from "@testing-library/react";

import { Tabs } from "./Tabs.component";

describe("Tabs snapshots", () => {
  it("should match tabs snapshot", (): void => {
    const { asFragment } = render(
      <Tabs
        items={[{ id: "all", label: "All", count: 3 }, { id: "active", label: "Active" }]}
        activeId="all"
        onChange={jest.fn()}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
