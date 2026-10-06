import * as React from "react";

import { MasterMainComponent } from "./MasterMain.component";
import { MASTER_MAIN_CONFIG } from "./MasterMain.config";

describe("MasterMainComponent Test", () => {
  it("should render component2", () => {
    const result = React.createElement(MasterMainComponent, {
      cards: MASTER_MAIN_CONFIG,
      onCardClick: () => {},
    });

    expect(result).toBeDefined();
  });
});
