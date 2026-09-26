import * as React from 'react';
import { QuotesComponent } from './Quotes.component';
import { useQuotesState } from './Quotes.hook';

/**
 * Render Quotes Container
 * @returns {React.ReactElement} - Quotes Container
 */
const QuotesContainer = (): React.ReactElement => {
  const state = useQuotesState();

  return <QuotesComponent {...state} />;
};

export default QuotesContainer;
