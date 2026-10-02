
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MOCK_USERS } from '../../../fixture/master-user';

import { MobileMasterUserDetailComponent } from './MobileMasterUserDetail.component';

/**
 * Render Mobile Master User Detail Container
 * @returns {React.ReactElement} Mobile Master User Detail Container Component
 */
const MobileMasterUserDetailContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const user = MOCK_USERS.find(u => u.id === id);

  /**
   * Handle delete
   * @returns {void} void
   */
  const handleDelete = (): void => {
    setShowConfirm(false);
    navigate("/master-user");
  };

  /**
   * Navigate back
   * @returns {void} void
   */
  const handleNavigateBack = (): void => { navigate(-1); };

  /**
   * Navigate edit
   * @returns {void} void
   */
  const handleNavigateEdit = (): void => { navigate(`/master-user/edit/${user?.id}`); };

  return (
    <MobileMasterUserDetailComponent 
      user={user ?? null}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
      handleDelete={handleDelete}
      onNavigateBack={handleNavigateBack}
      onNavigateEdit={handleNavigateEdit}
    />
  );
};

export default MobileMasterUserDetailContainer;
