import { PIC_FORM_DEFAULT_VALUES } from "./MasterPicCreate.config";
import type { PicValidValues } from "./MasterPicCreate.type";
import {
  buildPicPayload,
  formatApiMessages,
  getPicFieldErrors,
  normalizePicFormSource,
  resolvePicForm,
  sendPicMutation,
} from "./MasterPicCreate.util";

const VALID_VALUES: PicValidValues = { name: "Aurora", isActive: false };

const EXPECTED_PAYLOAD = { name: "Aurora", status: 0 };

const ROUTE_PIC = { id: "pic-1", name: "Aurora", status: "inactive", createdAt: "-" } as const;

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterPicCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("PIC request failed.");
  });

  it("should return a ready create source without an id", () => {
    expect(normalizePicFormSource({})).toEqual({ formStatus: "ready", initialValues: PIC_FORM_DEFAULT_VALUES });
  });

  it("should map the router-state PIC into form values", () => {
    expect(normalizePicFormSource({ id: "pic-1", routePic: ROUTE_PIC })).toEqual({
      formStatus: "ready",
      initialValues: { name: "Aurora", isActive: false },
    });
  });

  it("should return an error source without matching router state", () => {
    expect(normalizePicFormSource({ id: "pic-1" }).formStatus).toBe("error");
    expect(normalizePicFormSource({ id: "pic-2", routePic: ROUTE_PIC }).formStatus).toBe("error");
  });

  it("should trim the name and require it", () => {
    expect(resolvePicForm({ ...VALID_VALUES, name: " Aurora " })).toEqual({ values: VALID_VALUES, errors: {} });
    expect(getPicFieldErrors(resolvePicForm({ ...PIC_FORM_DEFAULT_VALUES, name: " " }).errors)).toEqual({ name: "PIC name is required." });
  });

  it("should build the request body with the status code", () => {
    expect(buildPicPayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildPicPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id, otherwise create", async () => {
    const createPic = createMutation();
    const updatePic = createMutation();

    await sendPicMutation(VALID_VALUES, { createPic, updatePic });
    await sendPicMutation(VALID_VALUES, { id: "pic-1", createPic, updatePic });

    expect(createPic).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updatePic).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "pic-1" });
  });
});
