import test from "../../libs/unit-test";

import MasterMainContainer from "./MasterMain.container";

const configs = [
  {
    props: {},
    desc: "Should Render MasterMainContainer with default props",
  },
];

it("MasterMainContainer matches snapshot", () => {
  test.assertSnapshots(MasterMainContainer, configs);
});
