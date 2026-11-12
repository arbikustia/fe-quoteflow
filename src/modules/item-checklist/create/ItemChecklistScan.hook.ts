import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { SCAN_HIGHLIGHT_DURATION_MS } from "./ItemChecklistCreate.config";
import type { UseItemChecklistScanInput } from "./ItemChecklistCreate.type";

/**
 * Add a scanned row without duplicating its identifier.
 * @param {string[]} currentIds - Current scanned row ids
 * @param {string} id - Identifier to append
 * @returns {string[]} Updated row ids
 */
const _addScannedId = (currentIds: string[], id: string): string[] =>
  currentIds.includes(id) ? currentIds : [...currentIds, id];

/**
 * Determine whether the event originated in an editable field.
 * @param {EventTarget | null} target - Event target
 * @returns {boolean} True if editable target
 */
const _isEditableTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement;

/**
 * Apply a completed scan: check the row in the focused column and flash it, or report not found.
 * @param {UseItemChecklistScanInput} input - Scanner options and state setters
 * @param {string} scannedCode - Scanned item code
 * @param {RefObject<number>} highlightTimer - Highlight reset timer
 * @returns {void}
 */
const _applyScan = (input: UseItemChecklistScanInput, scannedCode: string, highlightTimer: RefObject<number>): void => {
  const row = input.orderItems.find((item) => item.itemId === scannedCode);

  if (!row) {
    if (scannedCode) input.setNotFoundItemCode(scannedCode);

    return;
  }

  const setIds = input.focusAt === "moveIn" ? input.setMoveInItemIds : input.setMoveOutItemIds;

  input.setNotFoundItemCode("");
  input.setSearchTerm("");
  setIds((currentIds) => _addScannedId(currentIds, row.id));
  input.setHighlightedRowId(row.id);
  window.clearTimeout(highlightTimer.current);
  highlightTimer.current = window.setTimeout((): void => input.setHighlightedRowId(""), SCAN_HIGHLIGHT_DURATION_MS);
};

/**
 * Manage barcode scanning for item checklist.
 * @param {UseItemChecklistScanInput} input - Scanner options and state setters
 * @returns {void}
 */
export const useItemChecklistScan = (input: UseItemChecklistScanInput): void => {
  const scanBuffer = useRef("");
  const scanResetTimer = useRef(0);
  const highlightTimer = useRef(0);

  useEffect((): (() => void) => {
    /**
     * Handle scan event.
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {void}
     */
    const handleScan = (event: KeyboardEvent): void => {
      if (_isEditableTarget(event.target)) return;

      if (event.key === "Enter") {
        const scannedCode = scanBuffer.current;

        scanBuffer.current = "";
        window.clearTimeout(scanResetTimer.current);
        _applyScan(input, scannedCode, highlightTimer);

        return;
      }

      if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

      scanBuffer.current += event.key;
      window.clearTimeout(scanResetTimer.current);
      scanResetTimer.current = window.setTimeout((): void => {
        scanBuffer.current = "";
      }, 100);
    };

    window.addEventListener("keydown", handleScan);

    return (): void => {
      window.removeEventListener("keydown", handleScan);
      window.clearTimeout(scanResetTimer.current);
    };
  }, [input]);

  useEffect((): (() => void) => (): void => window.clearTimeout(highlightTimer.current), []);
};
