import { render } from "@testing-library/react";

import { MobileList } from "./MobileList.component";

describe("MobileList snapshots", () => {
  it("should match populated list snapshot", (): void => {
    const { asFragment } = render(<MobileList data={[{ title: "Customer", subtitle: "Active" }]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
