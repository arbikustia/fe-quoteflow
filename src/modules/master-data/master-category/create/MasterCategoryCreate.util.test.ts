import { buildCategoryPayload, formatApiMessages, normalizeCategoryFormSource, resolveCategoryForm, sendCategoryMutation } from "./MasterCategoryCreate.util";

describe("MasterCategoryCreate util", () => {
  it("should join backend messages or use the default message", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Bad request")).toBe("Bad request");
    expect(formatApiMessages(null)).toBe("Category request failed.");
  });

  it("should return a ready empty form in create mode", () => {
    expect(normalizeCategoryFormSource({})).toEqual({
      formStatus: "ready",
      initialValues: { name: "", isActive: true },
    });
  });

  it("should return an error state when the router state has no matching category", () => {
    const routeCategory = { id: "c-2", categoryName: "Audio", status: "active", createdAt: "-" } as const;

    expect(normalizeCategoryFormSource({ id: "c-1" }).formStatus).toBe("error");
    expect(normalizeCategoryFormSource({ id: "c-1", routeCategory }).formStatus).toBe("error");
  });

  it("should map the category from router state into form values", () => {
    const routeCategory = { id: "c-1", categoryName: "Audio", status: "inactive", createdAt: "-" } as const;

    expect(normalizeCategoryFormSource({ id: "c-1", routeCategory })).toEqual({
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
