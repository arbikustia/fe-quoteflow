import apiClient from "./ApiClient";

describe("apiClient defaults", () => {
  it("should not force a JSON content type so multipart uploads keep their files", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBeUndefined();
    expect(apiClient.defaults.headers.common["Content-Type"]).toBeUndefined();
  });
});
