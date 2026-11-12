import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { ITEM_FORM_DEFAULT_VALUES } from "./MasterItemCreate.config";
import { useMasterItemCreate } from "./MasterItemCreate.hook";
import type { ItemFormValues, MasterItemCreateParams } from "./MasterItemCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: ItemFormValues = {
  ...ITEM_FORM_DEFAULT_VALUES,
  name: "Beam 290",
  categoryId: "category-1",
  price: "100000",
  stock: "11",
  duration: "1",
};

/**
 * Build an input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const changeEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

/**
 * Build a file input change event.
 * @param {File} [file] - Selected file
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const fileEvent = (file?: File): ChangeEvent<HTMLInputElement> => ({ target: { files: file ? [file] : [] } }) as never;

/**
 * Build a form submit event.
 * @returns {SubmitEvent<HTMLFormElement>} - Submit event
 */
const submitEvent = (): SubmitEvent<HTMLFormElement> => ({ preventDefault: jest.fn(), persist: jest.fn() }) as never;

/**
 * Build a mutation trigger that resolves with the given response.
 * @param {MockMutationResponse} response - Mutation response
 * @returns {jest.Mock} - Mutation trigger
 */
const mutationOf = (response: MockMutationResponse): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<MockMutationResponse> => Promise.resolve(response) }));

/**
 * Build hook params.
 * @param {Partial<MasterItemCreateParams>} [overrides] - Params to override
 * @returns {MasterItemCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterItemCreateParams>): MasterItemCreateParams => ({
  mode: "create",
  initialValues: ITEM_FORM_DEFAULT_VALUES,
  createItem: mutationOf({ status: true }),
  updateItem: mutationOf({ status: true }),
  uploadImage: jest.fn(() => ({ unwrap: (): Promise<{ url: string }> => Promise.resolve({ url: "https://cdn.example.com/beam.jpg" }) })) as never,
  ...overrides,
});

describe("useMasterItemCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit with field errors, then clear them on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterItemCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Item name is required.");
    expect(result.current.fieldErrors.categoryId).toBe("Category is required.");
    expect(params.createItem).not.toHaveBeenCalled();

    act(() => result.current.handleTextChange.name(changeEvent("Beam")));
    act(() => result.current.handleCategoryChange("category-1"));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.fieldErrors.categoryId).toBeUndefined();
  });

  it("should upload an image, create the item and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterItemCreate(params));

    await act(() => result.current.handleImageChange(fileEvent()));
    expect(params.uploadImage).not.toHaveBeenCalled();

    act(() => {
      result.current.handleTextChange.name(changeEvent("Beam 290"));
      result.current.handleTextChange.price(changeEvent("Rp 100.000"));
      result.current.handleTextChange.stock(changeEvent("11"));
      result.current.handleTextChange.duration(changeEvent("1"));
      result.current.handleCategoryChange("category-1");
      result.current.handleRemarkChange({ target: { value: "Lighting" } } as never);
    });
    await act(() => result.current.handleImageChange(fileEvent(new File(["x"], "beam.jpg"))));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createItem).toHaveBeenCalledWith({
      name: "Beam 290",
      category_id: "category-1",
      price: 100000,
      stock: 11,
      image: "https://cdn.example.com/beam.jpg",
      duration: 1,
      remark: "Lighting",
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-item", { state: { successMessage: "Item created successfully." } });
  });

  it("should show an upload error when the image upload fails", async () => {
    const uploadImage = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("upload")) }));
    const { result } = renderHook(() => useMasterItemCreate(createParams({ uploadImage })));

    await act(() => result.current.handleImageChange(fileEvent(new File(["x"], "beam.jpg"))));

    expect(result.current.imageUploadError).toBe("Unable to upload image. Please try again.");
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createItem: mutationOf({ status: false, messages: ["Duplicate item"] }) });
    const { result } = renderHook(() => useMasterItemCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate item");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateItem = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const { result } = renderHook(() => useMasterItemCreate(createParams({ id: "item-1", mode: "edit", initialValues: FILLED_VALUES, updateItem })));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update item. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "item-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterItemCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateItem).toHaveBeenCalledWith(expect.objectContaining({ id: "item-1", status: 0 }));
    expect(mockNavigate).toHaveBeenCalledWith("/master-item", { state: { successMessage: "Item updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterItemCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-item");
  });
});
