import { MasterMainComponent } from "./MasterMain.component";
import { MASTER_MAIN_CONFIG } from "./MasterMain.config";
import test from "../../libs/unit-test";

const configs = [
  {
    props: {
      cards: MASTER_MAIN_CONFIG,
      onCardClick: (): void => {},
    },
    desc: "Should Render MasterMainComponent with default props",
  },
];

it("MasterMainComponent matches snapshot", () => {
  test.assertSnapshots(MasterMainComponent, configs);
});
