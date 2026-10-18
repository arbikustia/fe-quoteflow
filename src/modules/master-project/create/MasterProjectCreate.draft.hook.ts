import type { ChangeEvent } from "react";
import { useState } from "react";

import { mapProjectSelectedItems } from "./MasterProjectCreate.helpers";
import { useProjectItemSelection } from "./MasterProjectCreate.items.hook";

import type {
  ApiProject,
  ProjectDraftFormState,
  ProjectFormStep,
  ProjectItemOption,
} from "@/modules/master-project/MasterProject.type";

/**
 * Create input field change handler.
 * @param {(val: string) => void} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createInputChange = (
  setter: (val: string) => void,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.target.value);
  }
);

/**
 * Manage project form input state and step wizard.
 * @param {ApiProject | null} project - Initial project data
 * @param {ProjectItemOption[]} items - Loaded item options
 * @returns {ProjectDraftFormState} Draft form state
 */
export const useProjectDraft = (
  project: ApiProject | null,
  items: ProjectItemOption[],
): ProjectDraftFormState => {
  const [step, setStep] = useState<ProjectFormStep>(1);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [initializedId, setInitializedId] = useState<string | null>(null);
  const itemSelection = useProjectItemSelection();

  if (project && items.length > 0 && project.id !== initializedId) {
    setInitializedId(project.id);
    setName(project.name ?? "");
    setRemark(project.remark ?? "");
    itemSelection.setSelectedItems(mapProjectSelectedItems(project, items));
  }

  const handleNameChange = _createInputChange(setName);
  const handleRemarkChange = _createInputChange(setRemark);
  /**
   * Advance to next step.
   * @returns {void} No return
   */
  const nextStep = (): void => { setStep((current) => (current + 1) as ProjectFormStep); };
  /**
   * Return to previous step.
   * @returns {void} No return
   */
  const previousStep = (): void => { setStep((current) => (current - 1) as ProjectFormStep); };

  return {
    step,
    name,
    remark,
    selectedItems: itemSelection.selectedItems,
    handleNameChange,
    handleRemarkChange,
    toggleItem: itemSelection.toggleItem,
    updateItemQuantity: itemSelection.updateItemQuantity,
    nextStep,
    previousStep,
  };
};
