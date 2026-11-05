import { render } from "@/libs/unit-test";

import { RichTextEditor } from "./RichTextEditor.component";

jest.mock("react-quill-new/dist/quill.snow.css", () => ({}));
jest.mock("react-quill-new", () => ({
  __esModule: true,
  default: ({ className }: { className: string }): React.ReactElement => <div data-testid="rich-text-editor" className={className} />,
}));

it("should place toolbar below editor on mobile and above editor on desktop", (): void => {
  const { getByTestId } = render(
    <RichTextEditor value="" onChange={jest.fn()} placeholder="Write your note..." />,
  );
  const editor = getByTestId("rich-text-editor");

  expect(editor).toHaveClass("flex", "flex-col");
  expect(editor.className).toContain("[&_.ql-container]:order-1");
  expect(editor.className).toContain("[&_.ql-toolbar]:order-2");
  expect(editor.className).toContain("lg:[&_.ql-container]:order-2");
  expect(editor.className).toContain("lg:[&_.ql-toolbar]:order-1");
});
