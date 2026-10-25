import { MASTER_ITEM_CONFIG } from "./MasterItem.config";

describe("MasterItem config", (): void => {
  it("should expose item configuration object", (): void => {
    expect(MASTER_ITEM_CONFIG).toEqual({});
  });
});
