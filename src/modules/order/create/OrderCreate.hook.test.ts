import { describe, expect, it, jest } from "@jest/globals";

import { renderHook } from "@/libs/unit-test";

import { useOrderCreateLogic } from "./OrderCreate.hook";
import { useOrderCreateForm } from "./helpers/OrderCreateForm.helpers";

jest.mock("./helpers/OrderCreateForm.helpers", () => ({
  useOrderCreateForm: jest.fn(),
}));

describe("useOrderCreateLogic", (): void => {
  it("should expose the order create form state", (): void => {
    const formState = { eventName: "Annual Meeting" };
    jest.mocked(useOrderCreateForm).mockReturnValue(formState as never);

    const { result } = renderHook(() => useOrderCreateLogic());

    expect(result.current).toBe(formState);
    expect(useOrderCreateForm).toHaveBeenCalledTimes(1);
  });
});
