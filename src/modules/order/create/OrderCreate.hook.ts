import { useOrderCreateForm } from "./helpers/OrderCreateForm.helpers";
import type { OrderCreateState } from "./OrderCreate.type";

/**
 * Manage order creation form state, validation, and submission.
 * @returns {OrderCreateState} - Order creation state and handlers.
 */
export const useOrderCreateLogic = (): OrderCreateState => {
  return useOrderCreateForm();
};
