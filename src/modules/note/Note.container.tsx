import type { ReactElement } from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { NoteComponent } from "./Note.component";
import { useNote } from "./Note.hook";

/**
 * Render note page container.
 * @returns {ReactElement} Note page
 */
const NoteContainer = (): ReactElement | null => {
  const state = useNote();
  const { canView } = usePagePermission("/note");

  if (!canView) return null;

  return <NoteComponent {...state} />;
};

export default NoteContainer;
