import test from "@/libs/unit-test";

import { CheckboxComponent } from "./Checkbox.component";
import type { CheckboxProps } from "./Checkbox.type";

const props: CheckboxProps = {
  label: "Remember me",
  checked: true,
  onChange: jest.fn(),
};

test.assertSnapshots(CheckboxComponent, [{ props, desc: "should render checked checkbox" }]);
