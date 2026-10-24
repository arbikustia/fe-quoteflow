import test from "@/libs/unit-test";

import { SkeletonComponent } from "./Skeleton.component";

const configs = [
  {
    props: {},
    desc: "should render default skeleton table",
  },
  {
    props: { rows: 2, columns: [{ width: "25%" }, { width: "75%" }] },
    desc: "should render dynamic skeleton table",
  },
];

test.assertSnapshots(SkeletonComponent, configs);
