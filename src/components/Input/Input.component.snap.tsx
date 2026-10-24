import { render } from "@testing-library/react";

import { InputComponent } from "./Input.component";

it("should render a labelled Ant Design input", (): void => {
  const { asFragment } = render(<InputComponent id="name" label="Name" value="" required onChange={jest.fn()} />);

  expect(asFragment()).toMatchSnapshot();
});
