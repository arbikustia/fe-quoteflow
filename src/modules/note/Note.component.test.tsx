import { fireEvent, render, screen } from "@testing-library/react";

import { NoteComponent } from "./Note.component";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

describe("NoteComponent", () => {
  it("should wrap compact mobile notes into two columns and pad the note dialog", (): void => {
    const note = { id: "1", content: "<h1>Catatan</h1><p>Isi catatan</p>", updatedAt: "2 Nov 2026" };
    const onOpenNote = jest.fn();

    const { container } = render(<NoteComponent notes={[note, { ...note, id: "2" }]} selectedNote={note} onCreateNote={jest.fn()} onOpenNote={onOpenNote} onCloseNote={jest.fn()} />);

    expect(container.querySelector("main")).not.toHaveClass("overflow-hidden");
    expect(container.querySelector(".rounded-2xl.bg-background-surface")).not.toHaveClass("overflow-auto", "lg:overflow-auto");
    expect(container.querySelector(".grid-cols-2.lg\\:grid-cols-5")).toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(2);
    expect(container.querySelector("article .bg-accent-500")).not.toBeInTheDocument();
    expect(container.querySelector("article > div")).toHaveClass("flex-1");
    fireEvent.click(container.querySelector("article")!);
    expect(onOpenNote).toHaveBeenCalledWith(note);
    expect(screen.getByRole("dialog")).toHaveTextContent("Isi catatan");
    expect(screen.getByRole("dialog")).toHaveClass("h-[80dvh]", "lg:h-[80vh]");
    expect(screen.getByRole("dialog").querySelector(".min-h-0.flex-1.p-5")).toBeInTheDocument();
  });
});
