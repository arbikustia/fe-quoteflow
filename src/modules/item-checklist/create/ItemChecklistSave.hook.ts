import type { ChecklistCreatePayload } from "../ItemChecklist.type";

import type {
  ChecklistPayloadParams,
  ChecklistSaveError,
  ChecklistSaveResult,
  UseItemChecklistSaveInput,
} from "./ItemChecklistCreate.type";

/**
 * Build checklist payload.
 * @param {ChecklistPayloadParams} params - payload parameters
 * @returns {ChecklistCreatePayload} - checklist payload
 */
export const buildChecklistPayload = (params: ChecklistPayloadParams): ChecklistCreatePayload => ({
  order_id: params.orderId,
  ...(params.checklist ? { checklist_no: params.checklist.checklist_no } : {}),
  status: params.status,
  items: params.rows.map((row) => ({
    item_id: row.itemId,
    description: params.checklist?.items.find((entry) => entry.id === row.id)?.description ?? row.itemName,
    qty: row.qty,
    move_out: params.moveOutIds.includes(row.id),
    move_in: params.moveInIds.includes(row.id),
    sign: row.sign,
  })),
});

/**
 * Read a user-facing mutation error message.
 * @param {ChecklistSaveError} error - mutation error
 * @returns {string} - user-facing message
 */
const _getErrorMessage = (error: ChecklistSaveError): string => {
  let message: string | string[] | undefined;

  if ("data" in error) message = error.data as string | string[];
  else if ("message" in error) message = error.message;

  if (Array.isArray(message)) return message.join(" ");

  return typeof message === "string" ? message : "Unable to save item checklist.";
};

/**
 * Validate required save state.
 * @param {UseItemChecklistSaveInput} input - save inputs
 * @returns {string | undefined} - validation error if any
 */
const _getValidationError = (input: UseItemChecklistSaveInput): string | undefined => {
  if (input.isEditMode && (!input.checklist || !input.id)) return "Unable to load item checklist.";

  if (!input.isEditMode && !input.selectedOrder) return "Please select a rental order first.";

  return undefined;
};

/**
 * Run the appropriate checklist mutation.
 * @param {UseItemChecklistSaveInput} input - Save inputs
 * @param {ChecklistCreatePayload} payload - Payload
 * @returns {Promise<ChecklistSaveResult>} Mutation result
 */
const _saveChecklist = async (
  input: UseItemChecklistSaveInput,
  payload: ChecklistCreatePayload,
): Promise<ChecklistSaveResult> => {
  if (input.isEditMode && input.id) return await input.updateChecklist({ id: input.id, body: payload });

  return await input.createChecklist(payload);
};

/**
 * Record the successful save in the activity log.
 * @param {UseItemChecklistSaveInput} input - Save inputs
 * @returns {Promise<void>} Completed log request
 */
const _logSave = async (input: UseItemChecklistSaveInput): Promise<void> => {
  const name = input.checklist?.checklist_no ?? input.selectedOrder?.order_no ?? input.id ?? "Item Checklist";

  if (input.isEditMode) await input.logEdit(name);
  else await input.logCreate(name);
};

/**
 * Handle save logic for item checklist.
 * @param {UseItemChecklistSaveInput} input - Save inputs
 * @returns {() => Promise<void>} Save handler
 */
export const useItemChecklistSaveHandler = (
  input: UseItemChecklistSaveInput,
): (() => Promise<void>) => async (): Promise<void> => {
  const validationError = _getValidationError(input);

  if (validationError) {
    input.setSaveErrorMessage(validationError);

    return;
  }

  input.setSaveErrorMessage(null);
  const payload = buildChecklistPayload({
    orderId: input.checklist?.order_id ?? input.selectedOrderId,
    status: input.checklist?.status ?? 1,
    rows: input.orderItems,
    moveOutIds: input.moveOutItemIds,
    moveInIds: input.moveInItemIds,
    ...(input.checklist ? { checklist: input.checklist } : {}),
  });
  const result = await _saveChecklist(input, payload);

  if (result.error) {
    input.setSaveErrorMessage(_getErrorMessage(result.error));

    return;
  }

  if (!result.data?.status) {
    input.setSaveErrorMessage(result.data?.messages.join(" ") || "Unable to save item checklist.");

    return;
  }

  await _logSave(input);
  input.navigate("/item-checklist");
};
