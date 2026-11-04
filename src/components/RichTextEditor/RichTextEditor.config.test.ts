import { RICH_TEXT_EDITOR_MODULES } from "./RichTextEditor.config";

it("should provide all note formatting tools", (): void => {
  expect(RICH_TEXT_EDITOR_MODULES.toolbar).toEqual([
    ["bold", "italic", "underline"],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
  ]);
});
