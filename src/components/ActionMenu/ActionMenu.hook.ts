import { useEffect, useRef } from "react";

import type { ActionMenuState } from "./ActionMenu.type";

/**
 * Close action menu after outside interaction or Escape.
 * @returns {ActionMenuState} Action menu state
 */
export const useActionMenu = (): ActionMenuState => {
  const rootRef = useRef<HTMLDetailsElement>(null);
  /** Close current menu. */
  const closeMenu = (): void => { rootRef.current?.removeAttribute("open"); };

  useEffect((): (() => void) => {
    /**
     * Close when pointer target is outside menu.
     * @param {MouseEvent} event - Pointer event
     */
    const handlePointerDown = (event: MouseEvent): void => {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) closeMenu();
    };
    /**
     * Close when Escape is pressed.
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return (): void => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { rootRef };
};
