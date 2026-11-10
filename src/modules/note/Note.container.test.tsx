import * as React from "react";
import { render, screen } from "@/libs/unit-test";
import { jest, describe, it, expect } from "@jest/globals";
import NoteContainer from "./Note.container";
import { usePagePermission } from "@/hooks/usePagePermission";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn(),
}));

jest.mock("./Note.hook", () => ({
  useNote: jest.fn().mockReturnValue({}),
}));

jest.mock("./Note.component", () => ({
  NoteComponent: () => <div data-testid="note-page" />,
}));

describe("NoteContainer", () => {
  it("should render component when view is allowed", () => {
    jest.mocked(usePagePermission).mockReturnValue({
      canView: true,
      canCreate: false,
      canEdit: false,
      isSuperadmin: false,
    });

    render(<NoteContainer />);
    expect(screen.getByTestId("note-page")).toBeInTheDocument();
  });

  it("should not render component when view is denied", () => {
    jest.mocked(usePagePermission).mockReturnValue({
      canView: false,
      canCreate: false,
      canEdit: false,
      isSuperadmin: false,
    });

    render(<NoteContainer />);
    expect(screen.queryByTestId("note-page")).not.toBeInTheDocument();
  });
});
