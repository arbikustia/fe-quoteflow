import * as React from "react";
import { createPortal } from "react-dom";

import type { ModalProps } from "./Modal.type";

/**
 * Render modal header.
 * @param {string} title - Modal title
 * @param {() => void} onClose - Close handler
 * @returns {React.ReactElement} Modal header
 */
const _renderHeader = (title: string, onClose: () => void): React.ReactElement => (
  <div className="flex shrink-0 items-center justify-between border-b border-border-default px-6 py-4">
    <h2 id="modal-title" className="text-lg font-bold text-text-primary">{title}</h2>
    <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

/**
 * Render generic modal.
 * @param {ModalProps} props - Modal component props
 * @returns {React.ReactElement | null} Modal or null
 */
export const ModalComponent = (props: ModalProps): React.ReactElement | null => {
  const { isOpen, onClose, title, children, maxWidth = "max-w-2xl" } = props;

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 sm:p-6">
      <button type="button" aria-label="Close modal backdrop" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`relative flex h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-medium`}>
        {_renderHeader(title, onClose)}
        <div className="max-h-[90vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
