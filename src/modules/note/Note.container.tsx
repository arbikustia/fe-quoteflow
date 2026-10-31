import type { ReactElement } from "react";

import { NoteComponent } from "./Note.component";
import { useNote } from "./Note.hook";

/**
 * Render note page container.
 * @returns {ReactElement} Note page
 */
const NoteContainer = (): ReactElement => {
  const state = useNote();

  return <NoteComponent {...state} />;
};

export default NoteContainer;
