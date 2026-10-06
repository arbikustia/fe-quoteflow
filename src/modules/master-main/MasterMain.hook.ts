import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_MAIN_CONFIG } from "./MasterMain.config";

/**
 * Master Main state hook
 * @returns {object} state and handlers
 */
export const useMasterMainState = (): {
  readonly cards: typeof MASTER_MAIN_CONFIG;
  readonly onCardClick: (path: string) => void;
} => {
  const navigate = useNavigate();

  const onCardClick = useCallback(
    (path: string): void => {
      navigate(path);
    },
    [navigate],
  );

  return {
    cards: MASTER_MAIN_CONFIG,
    onCardClick,
  };
};
