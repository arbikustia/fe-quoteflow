import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MasterMainComponent } from "./MasterMain.component";
import { MASTER_MAIN_CONFIG } from "./MasterMain.config";

/**
 * Master Main Container
 * @returns {React.ReactElement} - container
 */
const MasterMainContainer = (): React.ReactElement => {
  const navigate = useNavigate();

  const handleCardClick = (path: string): void => {
    navigate(path);
  };
  const handleBack = (): void => { void navigate(-1); };

  return (
    <MasterMainComponent
      cards={MASTER_MAIN_CONFIG}
      onCardClick={handleCardClick}
      onBack={handleBack}
    />
  );
};

export default MasterMainContainer;
