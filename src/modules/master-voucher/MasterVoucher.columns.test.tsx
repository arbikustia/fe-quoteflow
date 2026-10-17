import { describe, expect, it, jest } from "@jest/globals";

import { getColumns } from "./MasterVoucher.columns";

describe("MasterVoucher columns", () => {
  it("includes Name column right after No", () => {
    const columns = getColumns({
      currentPage: 1,
      pageSize: 10,
      onEdit: jest.fn(),
    });

    expect(columns[0].key).toBe("no");
    expect(columns[1].key).toBe("name");
    expect(columns[1].header).toBe("Name");
    expect(columns[2].key).toBe("code");
  });
});
