
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { MOCK_USERS } from '../../../fixture/master-user';

import { MobileMasterUserComponent } from './MobileMasterUser.component';

/**
 * Render Mobile Master User Container
 * @returns {React.ReactElement} Mobile Master User Container Component
 */
const MobileMasterUserContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  /**
   * Handle navigation
   * @param {string} path - route path to navigate
   * @returns {void} void
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <MobileMasterUserComponent 
      users={MOCK_USERS} 
      onNavigate={handleNavigate} 
    />
  );
};

export default MobileMasterUserContainer;
