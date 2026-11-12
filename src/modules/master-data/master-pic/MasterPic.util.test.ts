import { MOCK_PIC_LIST_RESPONSE } from "@/fixture/master-pic";

import { getPicRowNumber, normalizePicList } from "./MasterPic.util";

describe("MasterPic util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizePicList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      pics: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizePicList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizePicList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_PIC_LIST_RESPONSE, data: [{ name: "x" }] } as never;

    expect(normalizePicList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no PICs", () => {
    const data = { ...MOCK_PIC_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizePicList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize PICs with status and date", () => {
    const listView = normalizePicList({ data: MOCK_PIC_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.pics[0]).toEqual({
      id: "pic-1",
      name: "Aurora",
     
      status: "active",
      createdAt: "04 November 2026 20:57",
    });
    expect(listView.pics[1]).toEqual({ id: "pic-2", name: "Kristofer", status: "inactive", createdAt: "-" });
  });

  it("should show a placeholder for a missing name", () => {
    const data = { ...MOCK_PIC_LIST_RESPONSE, data: [{ ...MOCK_PIC_LIST_RESPONSE.data[1], name: null }] };

    expect(normalizePicList({ data, isLoading: false, isError: false }).pics[0].name).toBe("-");
  });

  it("should number rows across pages", () => {
    expect(getPicRowNumber(1, 10, 0)).toBe(1);
    expect(getPicRowNumber(3, 20, 4)).toBe(45);
  });
});
