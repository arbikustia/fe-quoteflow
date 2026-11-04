import * as React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import type { Props as BackButtonProps } from './BackButton.type';

/**
 * Render BackButton Component
 * @param {BackButtonProps} props - back button component props
 * @returns {React.ReactElement} - BackButtonComponent
 */
export const BackButtonComponent = (props: BackButtonProps): React.ReactElement => {
  const { onClick, className = '' } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-page text-text-primary transition-colors hover:bg-background-subtle focus-visible:ring-2 focus-visible:ring-focus-ring/30 ${className}`}
    >
      <FiArrowLeft className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};
