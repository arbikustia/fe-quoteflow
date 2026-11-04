import { fireEvent, render, screen } from "@/libs/unit-test";

import { NoteComponent } from "./Note.component";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

describe("NoteComponent", () => {
  it("should show note status and expose edit and delete actions", (): void => {
    const note = { id: "1", content: "<h1>Catatan</h1><p>Isi catatan</p>", status: 1, updatedAt: "2 Nov 2026" };
    const onOpenNote = jest.fn();
    const onEditNote = jest.fn();
    const onDeleteNote = jest.fn();

    const { container } = render(<NoteComponent notes={[note, { ...note, id: "2", status: 0 }]} selectedNote={note} deletingNote={null} isDeleting={false} errorMessage={null} onBack={jest.fn()} onCreateNote={jest.fn()} onOpenNote={onOpenNote} onCloseNote={jest.fn()} onEditNote={onEditNote} onDeleteNote={onDeleteNote} onCancelDelete={jest.fn()} onConfirmDelete={jest.fn()} />);

    expect(container.querySelector("main")).not.toHaveClass("overflow-hidden");
    expect(container.querySelector(".rounded-3xl.bg-background-surface")).not.toHaveClass("overflow-auto", "lg:overflow-auto");
    expect(container.querySelector(".grid-cols-2.lg\\:grid-cols-5")).toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(2);
    expect(container.querySelector("article .bg-accent-500")).not.toBeInTheDocument();
    expect(container.querySelector("article > div")).toHaveClass("flex-1");
    expect(container.querySelector("article")).toHaveTextContent("2 Nov 2026");
    expect(screen.getByRole("button", { name: /New note/i })).toBeInTheDocument();
    expect(screen.getAllByText("Active")).toHaveLength(2);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText("More options")[0]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "Edit" })[0]);
    expect(onEditNote).toHaveBeenCalledWith(note);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "Delete" })[0]);
    expect(onDeleteNote).toHaveBeenCalledWith(note);
    fireEvent.click(container.querySelector("article")!);
    expect(onOpenNote).toHaveBeenCalledWith(note);
    expect(screen.getByRole("dialog")).toHaveTextContent("Isi catatan");
    expect(screen.getByRole("dialog")).toHaveTextContent("Active");
    expect(screen.getByRole("dialog")).toHaveTextContent("2 Nov 2026");
    expect(screen.getByRole("dialog")).toHaveClass("h-[80dvh]", "lg:h-[80vh]");
    expect(screen.getByRole("dialog").querySelector(".min-h-0.flex-1.p-5")).toBeInTheDocument();
  });

  it("should preserve unordered and ordered list styling in note detail", (): void => {
    const note = {
      id: "1",
      content: "<ul><li>Bullet item</li></ul><ol><li>Numbered item</li></ol>",
      status: 1,
      updatedAt: "2 Nov 2026",
    };

    render(<NoteComponent notes={[note]} selectedNote={note} deletingNote={null} isDeleting={false} errorMessage={null} onBack={jest.fn()} onCreateNote={jest.fn()} onOpenNote={jest.fn()} onCloseNote={jest.fn()} onEditNote={jest.fn()} onDeleteNote={jest.fn()} onCancelDelete={jest.fn()} onConfirmDelete={jest.fn()} />);

    const dialog = screen.getByRole("dialog");
    const content = dialog.querySelector(".max-w-none");
    expect(content).toHaveClass("[&_ul]:list-disc", "[&_ol]:list-decimal", "[&_li]:mb-2");
    expect(dialog.querySelector("ul > li")).toHaveTextContent("Bullet item");
    expect(dialog.querySelector("ol > li")).toHaveTextContent("Numbered item");
  });
});
