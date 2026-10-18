import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiItem } from "@/modules/master-item/MasterItem.type";
import type {
  MasterProjectCreateFormState,
  ProjectFormStep,
  ProjectItemOption,
  ProjectItemSelection,
} from "@/modules/master-project/MasterProject.type";
import { useGetAllItemsQuery } from "@/services/master-item.service";
import { useCreateProjectMutation, useGetProjectByIdQuery, useUpdateProjectMutation } from "@/services/master-project.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Project request failed.";
};

/**
 * Map API items to project item options.
 * @param {ReturnType<typeof useGetAllItemsQuery>["data"]} response - Item response
 * @returns {ProjectItemOption[]} Item options
 */
const _mapItemOptions = (
  response: ReturnType<typeof useGetAllItemsQuery>["data"],
): ProjectItemOption[] => response?.status ? response.data.map((item: ApiItem) => ({
  id: item.id,
  name: item.name,
  image: item.image ?? "",
  price: item.price ?? 0,
  stock: item.stock ?? 0,
})) : [];

/**
 * Manage master project create form state and submission.
 * @returns {MasterProjectCreateFormState} Form state and handlers
 */
// Three steps share one draft, so state stays in one route-level hook.
// eslint-disable-next-line max-lines-per-function
export const useMasterProjectCreate = (): MasterProjectCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const isEdit = Boolean(id);
  const [step, setStep] = useState<ProjectFormStep>(1);
  const [selectedItems, setSelectedItems] = useState<ProjectItemSelection[]>([]);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: itemResponse, isLoading: isItemsLoading, error: itemError } = useGetAllItemsQuery();
  const { data: projectResponse, isLoading: isProjectLoading } = useGetProjectByIdQuery(id ?? "", { skip: !isEdit });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const isSubmitting = isCreating || isUpdating || isProjectLoading;
  const project = projectResponse?.status ? projectResponse.data : null;
  const items = useMemo(() => _mapItemOptions(itemResponse), [itemResponse]);
  const itemsError = itemError || (itemResponse && !itemResponse.status) ? "Unable to load items." : null;

  useEffect(() => {
    if (!project || items.length === 0) {
      return;
    }

    setName(project.name ?? "");
    setRemark(project.remark ?? "");
    setSelectedItems((project.items ?? []).map((projectItem) => {
      const option = items.find((item) => item.id === projectItem.item_id);

      return option ? { ...option, qty: Math.max(1, Math.min(projectItem.qty, option.stock)) } : null;
    }).filter((item): item is ProjectItemSelection => item !== null));
  }, [items, project]);

  /** Update project name. */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setName(event.target.value);
  /** Update project remark. */
  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setRemark(event.target.value);
  /**
   * Select or remove item.
   * @param {ProjectItemOption} item - Item option
   */
  const toggleItem = (item: ProjectItemOption): void => {
    setSelectedItems((current) => current.some((selected) => selected.id === item.id)
      ? current.filter((selected) => selected.id !== item.id)
      : [...current, { ...item, qty: 1 }]);
  };

  /**
   * Change selected item quantity.
   * @param {string} itemId - Item ID
   * @param {number} quantity - New quantity
   */
  const updateItemQuantity = (itemId: string, quantity: number): void => {
    setSelectedItems((current) => current.map((item) => item.id === itemId
      ? { ...item, qty: Math.max(1, Math.min(quantity, item.stock)) }
      : item));
  };

  /** Continue to next valid step. */
  const nextStep = (): void => {
    setErrorMessage(null);

    if (step === 1 && selectedItems.length === 0) {
      setErrorMessage("Select at least one item.");

      return;
    }

    if (step === 2 && !name.trim()) {
      setErrorMessage("Project name is required.");

      return;
    }

    setStep((step + 1) as ProjectFormStep);
  };

  /** Return to previous step. */
  const previousStep = (): void => {
    setErrorMessage(null);
    setStep((step - 1) as ProjectFormStep);
  };

  /**
   * Submit new project to API.
   * @param {React.SyntheticEvent} event - Form submit event
   */
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (step !== 3) {
      nextStep();

      return;
    }

    try {
      const payload = {
        name,
        remark,
        status: 1,
        items: selectedItems.map((item) => ({ item_id: item.id, qty: item.qty })),
      };
      const response = isEdit && id
        ? await updateProject({ id, ...payload }).unwrap()
        : await createProject(payload).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage("Project created successfully.");
      navigate("/master-project");
    } catch {
      setErrorMessage("Unable to create project. Please try again.");
    }
  };

  /** Navigate back. */
  const goBack = (): void => { navigate(-1); };

  return {
    step, items, selectedItems, isItemsLoading, itemsError, name, remark,
    isSubmitting, errorMessage, successMessage, handleNameChange, handleRemarkChange,
    nextStep, previousStep, toggleItem, updateItemQuantity, handleSubmit, goBack,
  };
};
