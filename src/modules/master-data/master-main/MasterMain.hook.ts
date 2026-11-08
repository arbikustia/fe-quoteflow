import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_MAIN_CONFIG, MASTER_MAIN_IMAGES } from "./MasterMain.config";

/**
 * Preload master illustrations before displaying master cards.
 *
 * @returns {boolean} Whether all master illustrations finished loading
 */
export const useMasterIllustrationsLoaded = (): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sources = Array.from(MASTER_MAIN_IMAGES.values());
    let loadedCount = 0;

    /**
     * Mark one illustration as settled and reveal cards once all settled.
     *
     * @returns {void} No return value
     */
    const markLoaded = (): void => {
      loadedCount += 1;

      if (loadedCount === sources.length && isMounted) {
        setIsLoaded(true);
      }
    };

    sources.forEach((source) => {
      const image = new Image();

      image.onload = markLoaded;
      image.onerror = markLoaded;
      image.src = source;

      if (image.complete) markLoaded();
    });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return isLoaded;
};

/**
 * Master Main state hook
 *
 * @returns {object} state and handlers
 */
export const useMasterMainState = (): {
  cards: typeof MASTER_MAIN_CONFIG;
  onCardClick: (path: string) => void;
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
