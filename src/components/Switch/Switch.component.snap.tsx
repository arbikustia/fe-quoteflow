import test from "@/libs/unit-test";

import { SwitchComponent } from "./Switch.component";
import type { SwitchProps } from "./Switch.type";

const props: SwitchProps = {
  label: "Customer status",
  checked: true,
  onChange: jest.fn(),
};

test.assertSnapshots(SwitchComponent, [{ props, desc: "should render checked switch" }]);
