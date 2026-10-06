import test from "@/libs/unit-test";

import MasterItemContainer from "./MasterItem.container";

const configs = [
  { props: {}, desc: "Should Render MasterItemContainer with default props" },
];

it("MasterItemContainer matches snapshot", () => {
  test.assertSnapshots(MasterItemContainer, configs);
});
