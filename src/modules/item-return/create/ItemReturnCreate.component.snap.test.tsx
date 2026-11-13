import { mockEmptyFormProps, mockSelectedFormProps } from "@/fixture/item-return-create";
import test from "@/libs/unit-test";

import { ItemReturnCreateForm } from "./ItemReturnCreate.component";

describe("ItemReturnCreateForm snapshot", () => {
  test.assertSnapshots(ItemReturnCreateForm, [
    { props: mockEmptyFormProps, desc: "should render the unselected form" },
    { props: mockSelectedFormProps, desc: "should render the selected order with table and search" },
  ]);
});
