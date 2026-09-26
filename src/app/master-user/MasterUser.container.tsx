import * as React from 'react';
import { MasterUserComponent } from './MasterUser.component';
import { useMasterUserState } from './MasterUser.hook';

/**
 * Render Master User Container
 * @returns {React.ReactElement} - Master User Container
 */
const MasterUserContainer = (): React.ReactElement => {
  const state = useMasterUserState();

  return <MasterUserComponent {...state} />;
};

export default MasterUserContainer;
