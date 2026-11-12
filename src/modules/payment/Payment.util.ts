import type * as React from "react";

import type { PaymentData, PaymentRowAction } from "./Payment.type";

/**
 * Create a row action click handler that does not bubble up to the table row click.
 * @param {PaymentData} payment - Payment of the row
 * @param {PaymentRowAction} action - Row action callback
 * @returns {(event: React.MouseEvent) => void} - Action button click handler
 */
export const createPaymentRowActionHandler = (payment: PaymentData, action: PaymentRowAction): ((event: React.MouseEvent) => void) => (event: React.MouseEvent): void => {
  event.stopPropagation();
  action(payment);
};
