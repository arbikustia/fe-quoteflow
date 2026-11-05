import type { ReactElement } from "react";
import ReactQuill from "react-quill-new";

import { RICH_TEXT_EDITOR_MODULES } from "./RichTextEditor.config";
import type { RichTextEditorProps } from "./RichTextEditor.type";

import "react-quill-new/dist/quill.snow.css";

/**
 * Render rich text editor.
 * @param {RichTextEditorProps} props - Editor props
 * @returns {ReactElement} Rich text editor
 */
export const RichTextEditor = (props: RichTextEditorProps): ReactElement => (
  <ReactQuill
    theme="snow"
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
    modules={RICH_TEXT_EDITOR_MODULES}
    className="flex flex-col rounded-xl border border-border-default bg-background-surface text-text-primary [&_.ql-container]:order-1 [&_.ql-container]:min-h-52 [&_.ql-container]:rounded-t-xl [&_.ql-container]:border-0 [&_.ql-container]:border-b [&_.ql-container]:border-border-default [&_.ql-editor]:min-h-52 [&_.ql-editor]:text-base [&_.ql-toolbar]:order-2 [&_.ql-toolbar]:rounded-b-xl [&_.ql-toolbar]:border-0 lg:[&_.ql-container]:order-2 lg:[&_.ql-container]:rounded-b-xl lg:[&_.ql-container]:rounded-t-none lg:[&_.ql-container]:border-b-0 lg:[&_.ql-toolbar]:order-1 lg:[&_.ql-toolbar]:rounded-b-none lg:[&_.ql-toolbar]:rounded-t-xl lg:[&_.ql-toolbar]:border-b lg:[&_.ql-toolbar]:border-border-default"
  />
);
