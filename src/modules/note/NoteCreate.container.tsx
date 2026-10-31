import type { ReactElement } from "react";

import { NoteCreateComponent } from "./NoteCreate.component";
import { useNoteCreate } from "./NoteCreate.hook";

/**
 * Render note create container.
 * @returns {ReactElement} Note create page
 */
const NoteCreateContainer = (): ReactElement => <NoteCreateComponent {...useNoteCreate()} />;

export default NoteCreateContainer;
