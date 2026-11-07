import { RICH_TEXT_EDITOR_MODULES } from "./RichTextEditor.config";

it("should provide all note formatting tools", (): void => {
  expect(RICH_TEXT_EDITOR_MODULES.toolbar).toEqual([
    ["bold", "underline"],
    [{ color: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
  ]);
});
