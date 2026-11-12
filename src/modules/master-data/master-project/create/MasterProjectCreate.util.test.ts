import { MOCK_PROJECT_DETAIL_RESPONSE, MOCK_PROJECT_ITEMS_RESPONSE } from "@/fixture/master-project";

import { PROJECT_FORM_DEFAULT_VALUES } from "./MasterProjectCreate.config";
import type { ProjectFormValues, ProjectItemOption, ProjectSelectedItem } from "./MasterProjectCreate.type";
import {
  buildProjectPayload,
  buildProjectSelectedItems,
  clampItemQuantity,
  findSelectedItem,
  formatApiMessages,
  formatProjectPrice,
  getAdjacentFormStep,
  getProjectFieldErrors,
  normalizeProjectFormSource,
  normalizeProjectItemOptions,
  resolveProjectForm,
  sendProjectMutation,
  shouldValidateField,
  toggleSelectedItem,
  updateSelectedItemQuantity,
} from "./MasterProjectCreate.util";

const OPTION: ProjectItemOption = { id: "item-1", name: "Beam 290", image: "", price: 100000, stock: 11 };
const SELECTED: ProjectSelectedItem = { ...OPTION, qty: 2 };
const VALID_VALUES: ProjectFormValues = { ...PROJECT_FORM_DEFAULT_VALUES, name: "Wedding", price: 5000, selectedItems: [SELECTED] };
const ITEMS_VIEW = normalizeProjectItemOptions({ data: MOCK_PROJECT_ITEMS_RESPONSE, isLoading: false, isError: false });

describe("MasterProjectCreate util", () => {
  it("should format messages and prices", () => {
    expect(formatApiMessages(["A", "B"])).toBe("A B");
    expect(formatApiMessages("Duplicate")).toBe("Duplicate");
    expect(formatApiMessages(null)).toBe("Project request failed.");
    expect(formatProjectPrice(1500000)).toBe(`Rp ${(1500000).toLocaleString("id-ID")}`);
  });

  it("should clamp quantity between 1 and stock", () => {
    expect(clampItemQuantity(0, 5)).toBe(1);
    expect(clampItemQuantity(9, 5)).toBe(5);
    expect(clampItemQuantity(3, 5)).toBe(3);
  });

  it("should normalize item options with loading, error, empty and ready states", () => {
    expect(normalizeProjectItemOptions({ isLoading: true, isError: false }).itemsStatus).toBe("loading");
    expect(normalizeProjectItemOptions({ isLoading: false, isError: true }).itemsStatus).toBe("error");
    expect(normalizeProjectItemOptions({ data: { ...MOCK_PROJECT_ITEMS_RESPONSE, status: false }, isLoading: false, isError: false }).itemsStatus).toBe("error");
    expect(normalizeProjectItemOptions({ data: { ...MOCK_PROJECT_ITEMS_RESPONSE, data: [] }, isLoading: false, isError: false }).itemsStatus).toBe("empty");
    expect(ITEMS_VIEW.itemsStatus).toBe("ready");
    expect(ITEMS_VIEW.itemOptions[1]).toEqual({ id: "item-2", name: "Wireless Mic", image: "", price: 0, stock: 0 });
  });

  it("should resolve project items against options and drop unknown items", () => {
    const projectItems = [
      { id: "a", item_id: "item-1", item_name: "Beam 290", qty: 99, price: 1, status: 1 },
      { id: "b", item_id: "missing", item_name: null, qty: 1, price: 1, status: 1 },
    ];

    expect(buildProjectSelectedItems(projectItems, ITEMS_VIEW.itemOptions)).toEqual([{ ...ITEMS_VIEW.itemOptions[0], qty: 11 }]);
  });

  it("should normalize the form source for create, loading, error and edit", () => {
    expect(normalizeProjectFormSource({ isLoading: false, isError: false, itemsView: ITEMS_VIEW })).toEqual({ formStatus: "ready", initialValues: PROJECT_FORM_DEFAULT_VALUES });
    expect(normalizeProjectFormSource({ isLoading: true, isError: false, itemsView: ITEMS_VIEW }).formStatus).toBe("loading");
    expect(normalizeProjectFormSource({ isLoading: false, isError: true, itemsView: ITEMS_VIEW }).formStatus).toBe("error");
    expect(normalizeProjectFormSource({ data: MOCK_PROJECT_DETAIL_RESPONSE, isLoading: false, isError: false, itemsView: { itemsStatus: "loading", itemOptions: [] } }).formStatus).toBe("loading");
    expect(normalizeProjectFormSource({ data: { ...MOCK_PROJECT_DETAIL_RESPONSE, status: false }, isLoading: false, isError: false, itemsView: ITEMS_VIEW }).formStatus).toBe("error");
    expect(normalizeProjectFormSource({ data: { ...MOCK_PROJECT_DETAIL_RESPONSE, data: null }, isLoading: false, isError: false, itemsView: ITEMS_VIEW }).formStatus).toBe("error");

    const edit = normalizeProjectFormSource({ data: MOCK_PROJECT_DETAIL_RESPONSE, isLoading: false, isError: false, itemsView: ITEMS_VIEW });

    expect(edit.formStatus).toBe("ready");
    expect(edit.initialValues).toMatchObject({ name: "Wedding Package", price: 5000000, remark: "Full stage setup", isActive: true });
    expect(edit.initialValues.selectedItems).toEqual([{ ...ITEMS_VIEW.itemOptions[0], qty: 4 }]);
  });

  it("should toggle, update and find selected items", () => {
    expect(toggleSelectedItem([], OPTION)).toEqual([{ ...OPTION, qty: 1 }]);
    expect(toggleSelectedItem([SELECTED], OPTION)).toEqual([]);
    expect(updateSelectedItemQuantity([SELECTED], "item-1", 50)[0].qty).toBe(11);
    expect(updateSelectedItemQuantity([SELECTED], "other", 5)).toEqual([SELECTED]);
    expect(findSelectedItem([SELECTED], "item-1")).toBe(SELECTED);
    expect(findSelectedItem([SELECTED], "x")).toBeUndefined();
  });

  it("should move through wizard steps within bounds", () => {
    expect(getAdjacentFormStep("items", 1)).toBe("information");
    expect(getAdjacentFormStep("preview", 1)).toBe("preview");
    expect(getAdjacentFormStep("items", -1)).toBe("items");
    expect(getAdjacentFormStep("preview", -1)).toBe("information");
  });

  it("should resolve valid values and report the first error per field", () => {
    expect(resolveProjectForm(VALID_VALUES)).toEqual({ values: { ...VALID_VALUES }, errors: {} });

    const { errors } = resolveProjectForm(PROJECT_FORM_DEFAULT_VALUES);

    expect(getProjectFieldErrors(errors)).toEqual({
      selectedItems: "Select at least one item.",
      name: "Project name is required.",
      price: "Project price is required.",
    });
    expect(getProjectFieldErrors(resolveProjectForm({ ...VALID_VALUES, price: -1 }).errors).price).toBe("Project price cannot be negative.");
  });

  it("should validate on change only after submit or while the field has an error", () => {
    expect(shouldValidateField(true, {}, "name")).toBe(true);
    expect(shouldValidateField(false, { name: { type: "x", message: "m" } }, "name")).toBe(true);
    expect(shouldValidateField(false, {}, "name")).toBe(false);
  });

  it("should build the request payload", () => {
    expect(buildProjectPayload({ ...VALID_VALUES, price: 5000, isActive: false })).toEqual({
      name: "Wedding",
      remark: "",
      price: 5000,
      status: 0,
      items: [{ item_id: "item-1", qty: 2, price: 100000 }],
    });
  });

  it("should send update when an id is given, otherwise create", async () => {
    const response = { status: true, data: null, messages: null };
    const createProject = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const updateProject = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const values = resolveProjectForm(VALID_VALUES).values as never;

    await sendProjectMutation(values, { createProject, updateProject });
    await sendProjectMutation(values, { id: "project-1", createProject, updateProject });

    expect(createProject).toHaveBeenCalledTimes(1);
    expect(updateProject).toHaveBeenCalledWith(expect.objectContaining({ id: "project-1", name: "Wedding" }));
  });
});
