
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MOCK_USERS } from '../../../fixture/master-user';

import { MobileMasterUserCreateComponent } from './MobileMasterUserCreate.component';

/**
 * Render Mobile Master User Create Container
 * @returns {React.ReactElement} Mobile Master User Create Container Component
 */
const MobileMasterUserCreateContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const existingUser = id ? MOCK_USERS.find(u => u.id === id) : null;
  const isEdit = !!existingUser;

  /**
   * Navigate back
   * @returns {void} void
   */
  const onNavigateBack = (): void => { navigate(-1); };
  /**
   * Submit form
   * @param {React.SyntheticEvent} e - form submit event
   * @returns {void} void
   */
  const onSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    navigate("/master-user");
  };

  return (
    <MobileMasterUserCreateComponent 
      existingUser={existingUser ?? null}
      isEdit={isEdit}
      onNavigateBack={onNavigateBack}
      onSubmit={onSubmit}
    />
  );
};

export default MobileMasterUserCreateContainer;
