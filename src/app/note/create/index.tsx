import type { ReactElement } from "react";

import NoteCreate from "@/modules/note/NoteCreate.container";

/**
 * Render note create page.
 * @returns {ReactElement} Note create page
 */
export default function NoteCreatePage(): ReactElement {
  return <NoteCreate />;
}
