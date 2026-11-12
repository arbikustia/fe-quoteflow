import { MOCK_API_PROJECTS, MOCK_PROJECT_LIST_RESPONSE } from "@/fixture/master-project";

import { getProjectRowNumber, normalizeProjectList } from "./MasterProject.util";

describe("MasterProject util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeProjectList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      projects: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeProjectList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeProjectList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_PROJECT_LIST_RESPONSE, data: [{ name: "x" }] } as never;

    expect(normalizeProjectList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no projects", () => {
    const data = { ...MOCK_PROJECT_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeProjectList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize projects with remark, status, date and item count", () => {
    const listView = normalizeProjectList({ data: MOCK_PROJECT_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.projects[0]).toMatchObject({ id: "project-1", name: "Wedding Package", remark: "Full stage setup", status: "active", itemCount: 1 });
    expect(listView.projects[1]).toEqual({ id: "project-2", name: "Meeting Package", remark: "-", status: "inactive", createdAt: "-", itemCount: 0 });
  });

  it("should treat an invalid status code as inactive", () => {
    const data = { ...MOCK_PROJECT_LIST_RESPONSE, data: [{ ...MOCK_API_PROJECTS[0], status: 7 }] } as never;

    expect(normalizeProjectList({ data, isLoading: false, isError: false }).projects[0].status).toBe("inactive");
  });

  it("should number rows across pages", () => {
    expect(getProjectRowNumber(1, 10, 0)).toBe(1);
    expect(getProjectRowNumber(3, 20, 4)).toBe(45);
  });
});
