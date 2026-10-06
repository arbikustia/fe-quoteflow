import MasterMainContainer from "./MasterMain.container";
import test from "../../libs/unit-test";

const configs = [
  {
    props: {},
    desc: "Should Render MasterMainContainer with default props",
  },
];

it("MasterMainContainer matches snapshot", () => {
  test.assertSnapshots(MasterMainContainer, configs);
});
