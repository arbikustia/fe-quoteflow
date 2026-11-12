import { buildCategoryPayload, formatApiMessages, normalizeCategoryFormSource, resolveCategoryForm, sendCategoryMutation } from "./MasterCategoryCreate.util";

describe("MasterCategoryCreate util", () => {
  it("should join backend messages or use the default message", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Bad request")).toBe("Bad request");
    expect(formatApiMessages(null)).toBe("Category request failed.");
  });

  it("should return a ready empty form in create mode", () => {
    expect(normalizeCategoryFormSource({ data: undefined, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "", isActive: true },
    });
  });

  it("should return loading and error states for the detail query", () => {
    expect(normalizeCategoryFormSource({ data: undefined, isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeCategoryFormSource({ data: undefined, isLoading: false, isError: true }).formStatus).toBe("error");
    expect(normalizeCategoryFormSource({ data: { status: false, data: null, messages: null }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should map the category detail into form values", () => {
    const data = { status: true, messages: null, data: { id: "1", category_name: "Audio", status: 0, created_at: null } };

    expect(normalizeCategoryFormSource({ data, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "Audio", isActive: false },
    });
  });

  it("should validate the category name", () => {
    expect(resolveCategoryForm({ name: "Audio", isActive: true })).toEqual({ values: { name: "Audio", isActive: true }, errors: {} });
    expect(resolveCategoryForm({ name: "  ", isActive: true }).errors.name?.message).toBe("Category name is required.");
  });

  it("should build the request body with the status code", () => {
    expect(buildCategoryPayload({ name: "Audio", isActive: false })).toEqual({ category_name: "Audio", status: 0 });
  });

  it("should update when an id exists and create otherwise", async () => {
    const response = { status: true, data: null, messages: null };
    const createCategory = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const updateCategory = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const values = { name: "Audio", isActive: true };

    await sendCategoryMutation(values, { createCategory, updateCategory });
    await sendCategoryMutation(values, { id: "c-1", createCategory, updateCategory });

    expect(createCategory).toHaveBeenCalledWith({ category_name: "Audio", status: 1 });
    expect(updateCategory).toHaveBeenCalledWith({ category_name: "Audio", status: 1, id: "c-1" });
  });
});
