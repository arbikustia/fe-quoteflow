import test from "@/libs/unit-test";

import { AlertComponent } from "./Alert.component";
import type { AlertProps } from "./Alert.type";

const infoProps: AlertProps = { message: "Customer information" };
const errorProps: AlertProps = { type: "error", message: "Unable to save customer.", description: "Try again." };

const configs = [
  {
    props: infoProps,
    desc: "should render info alert",
  },
  {
    props: errorProps,
    desc: "should render error alert with description",
  },
];

test.assertSnapshots(AlertComponent, configs);
