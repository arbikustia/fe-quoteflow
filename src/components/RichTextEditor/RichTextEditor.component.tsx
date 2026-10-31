import type { ReactElement } from "react";
import ReactQuill from "react-quill-new";

import type { RichTextEditorProps } from "./RichTextEditor.type";

import "react-quill-new/dist/quill.snow.css";

const MODULES = {
  toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
};

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
    modules={MODULES}
    className="rounded-xl border border-border-default bg-background-surface text-text-primary [&_.ql-container]:min-h-52 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-0 [&_.ql-editor]:min-h-52 [&_.ql-editor]:text-base [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-border-default"
  />
);
