import { MOCK_CATEGORY_LIST_RESPONSE } from "@/fixture/master-category";

import { getCategoryRowNumber, normalizeCategoryList } from "./MasterCategory.util";

describe("MasterCategory util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeCategoryList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      categories: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeCategoryList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeCategoryList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no categories", () => {
    const data = { ...MOCK_CATEGORY_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeCategoryList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize categories with status and formatted date", () => {
    const listView = normalizeCategoryList({ data: MOCK_CATEGORY_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(3);
    expect(listView.categories[0]).toEqual({
      id: "1",
      categoryName: "Audio System",
      status: "active",
      createdAt: new Date("2024-02-01T00:00:00Z").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    });
    expect(listView.categories[1].status).toBe("inactive");
    expect(listView.categories[2].createdAt).toBe("-");
  });

  it("should calculate the row number across pages", () => {
    expect(getCategoryRowNumber(2, 10, 0)).toBe(11);
  });
});
