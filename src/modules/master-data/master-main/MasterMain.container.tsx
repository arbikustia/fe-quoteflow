import * as React from "react";
import { useNavigate } from "react-router-dom";

import { MasterMainComponent } from "./MasterMain.component";
import { MASTER_MAIN_CONFIG } from "./MasterMain.config";
import { useMasterIllustrationsLoaded } from "./MasterMain.hook";

/**
 * Master Main Container
 *
 * @returns {React.ReactElement} - container
 */
const MasterMainContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const isLoaded = useMasterIllustrationsLoaded();

  /**
   * Navigate to the selected master page.
   *
   * @param {string} path - Target route path
   * @returns {void} No return value
   */
  const handleCardClick = (path: string): void => {
    navigate(path);
  };

  /**
   * Navigate back to the home page.
   *
   * @returns {void} No return value
   */
  const handleBack = (): void => { void navigate("/home"); };

  return (
    <MasterMainComponent
      cards={MASTER_MAIN_CONFIG}
      onCardClick={handleCardClick}
      onBack={handleBack}
      isLoaded={isLoaded}
    />
  );
};

export default MasterMainContainer;
