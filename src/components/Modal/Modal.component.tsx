import * as React from "react";

import type { ModalComponentProps } from "./Modal.type";

/**
 * Render modal header
 * @param {string} title - title string
 * @param {string} titleId - aria title id
 * @param {boolean} isCloseDisabled - close disabled state
 * @param {() => void} onClose - close handler
 * @returns {React.ReactElement} - modal header element
 */
const _renderModalHeader = (
  title: string,
  titleId: string,
  isCloseDisabled: boolean,
  onClose: () => void,
): React.ReactElement => (
  <div className="flex shrink-0 items-center justify-between border-b border-border-default px-6 py-4">
    <h2 className="text-base font-semibold" id={titleId}>{title}</h2>
    <button
      aria-label="Close dialog"
      className="rounded-medium p-2 text-text-secondary hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-60"
      disabled={isCloseDisabled}
      onClick={onClose}
      type="button"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </button>
  </div>
);

/**
 * Render modal content
 * @param {React.ReactNode} children - modal body content
 * @returns {React.ReactElement} - modal content element
 */
const _renderModalContent = (children: React.ReactNode): React.ReactElement => (
  <div className="overflow-y-auto p-6">{children}</div>
);

/**
 * Render accessible modal dialog UI
 * @param {ModalComponentProps} props - modal component props
 * @returns {React.ReactElement | null} - ModalComponent element
 */
export const ModalComponent = (props: ModalComponentProps): React.ReactElement | null => {
  const {
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-2xl",
    isCloseDisabled = false,
    closeOnBackdrop = true,
    dialogRef,
    titleId,
    handleDialogKeyDown,
  } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-overlay p-4 backdrop-blur-sm sm:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 cursor-default"
        data-testid="modal-backdrop"
        onClick={closeOnBackdrop && !isCloseDisabled ? onClose : undefined}
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={`relative flex max-h-modal w-full ${maxWidth} flex-col overflow-hidden rounded-large border border-border-default bg-background-surface text-text-primary shadow-overlay motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-normal motion-reduce:transition-none`}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        {_renderModalHeader(title, titleId, isCloseDisabled, onClose)}
        {_renderModalContent(children)}
      </div>
    </div>
  );
};
