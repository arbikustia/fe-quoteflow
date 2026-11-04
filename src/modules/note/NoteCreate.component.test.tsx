import { fireEvent, render, screen } from "@/libs/unit-test";

import { NoteCreateComponent } from "./NoteCreate.component";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

jest.mock("@/components/RichTextEditor", () => ({
  RichTextEditor: (): React.ReactElement => <div>Editor</div>,
}));

it("should show status switch and update action in edit mode", (): void => {
  const onStatusChange = jest.fn();
  const onBack = jest.fn();

  render(
    <NoteCreateComponent
      editorContent="<p>Note</p>"
      isActive={true}
      isEditMode={true}
      isSubmitting={false}
      errorMessage={null}
      onBack={onBack}
      onContentChange={jest.fn()}
      onStatusChange={onStatusChange}
      onSubmitNote={jest.fn()}
    />,
  );

  expect(screen.getByRole("button", { name: "Update Note" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onBack).toHaveBeenCalled();
  fireEvent.click(screen.getByRole("switch", { name: "Note status" }));
  expect(onStatusChange).toHaveBeenCalledWith(false, expect.anything());
});
