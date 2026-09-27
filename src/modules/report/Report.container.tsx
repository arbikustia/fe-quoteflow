import * as React from 'react';

import { ReportComponent } from './Report.component';
import { useReportState } from './Report.hook';

/**
 * Render Report Container
 * @returns {React.ReactElement} - Report Container
 */
const ReportContainer = (): React.ReactElement => {
  const state = useReportState();

  return <ReportComponent {...state} />;
};

export default ReportContainer;
