import { act, renderHook, waitFor } from "@/libs/unit-test";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

import type { ApiReturn } from "../ItemReturn.type";
import { useItemReturnCreate } from "./ItemReturnCreate.hook";

const mockUpdate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });
const mockCreate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });
const mockUpload = jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({ url: "/photos/return.jpg", file_name: "return.jpg" }) });
const mockCreateObjectURL = jest.fn(() => "blob:preview");
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(URL, "createObjectURL", { configurable: true, value: mockCreateObjectURL });
Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: mockRevokeObjectURL });
jest.mock("./ItemReturnPhoto.util", () => ({ stampReturnPhoto: (file: File) => Promise.resolve(file) }));

const mockReturn: ApiReturn = {
  id: "return-1",
  order_id: "order-1",
  return_date: "2026-11-03T10:00:00.000Z",
  notes: "Test notes",
  status: 1,
  created_at: "2026-11-03T10:00:00.000Z",
  updated_at: "2026-11-03T10:00:00.000Z",
  items: [
    {
      id: "entry-1",
      return_id: "return-1",
      item_id: "item-1",
      category_name: "Sound System",
      qty: 2,
      condition: "Good",
      notes: "Speaker",
      file_url: "",
      file_name: "",
      status: 1,
      created_at: "2026-11-03T10:00:00.000Z",
      updated_at: "2026-11-03T10:00:00.000Z",
    },
  ],
};

jest.mock("@/services/rental-return.service", () => ({
  useCreateRentalReturnMutation: () => [mockCreate, { isLoading: false }],
  useUpdateRentalReturnMutation: () => [mockUpdate, { isLoading: false }],
  useGetRentalReturnByIdQuery: () => ({ data: { status: true, data: mockReturn }, isLoading: false }),
}));

jest.mock("@/services/activity-log.service", () => ({
  useCreateActivityLogMutation: () => [jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) }), { isLoading: false }],
}));

jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrderOptionsQuery: () => ({
    data: {
      status: true,
      data: [
        {
          id: "order-1",
          order_no: "ORD-001",
          invoice: {
            quotation: {
              transaction: {
                customer_name: "Customer A",
                rental_transaction_items: [
                  {
                    item_id: "item-1",
                    item_name: "Speaker",
                    category_name: "Sound System",
                    qty: 2,
                  },
                  {
                    item_id: "item-2",
                    item_name: "Microphone",
                    qty: 1,
                  },
                ],
              },
            },
          },
        },
      ],
    },
    isLoading: false,
  }),
}));

jest.mock("@/services/master-item.service", () => ({
  useUploadImageMutation: () => [mockUpload, { isLoading: false }],
  useGetAllItemsQuery: () => ({
    data: {
      status: true,
      data: [{ id: "item-1", category_name: "Audio" }],
    },
  }),
}));

const EditRoute = ({ children }: { children: ReactNode }): ReactNode => (
  <MemoryRouter initialEntries={["/item-return/create/return-1"]}>
    <Routes>
      <Route path="/item-return/create/:id" element={children} />
      <Route path="/item-return" element={<div>List Page</div>} />
    </Routes>
  </MemoryRouter>
);

const CreateRoute = ({ children }: { children: ReactNode }): ReactNode => {
  let location: ReturnType<typeof useLocation> | null = null;
  const LocationTracker = (): null => {
    location = useLocation();
    return null;
  };

  return (
    <MemoryRouter initialEntries={["/item-return/create"]}>
      <LocationTracker />
      <Routes>
        <Route path="/item-return/create" element={children} />
        <Route path="/item-return" element={<div>List Page</div>} />
      </Routes>
      <div data-testid="location">{location ? (location as { pathname: string }).pathname : ""}</div>
    </MemoryRouter>
  );
};

describe("ItemReturnCreate.hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with rental orders and handle selection in create mode", () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });

    expect(result.current.isEditMode).toBe(false);
    expect(result.current.orderOptions).toHaveLength(1);
    expect(result.current.orderOptions[0].label).toContain("Customer A — ORD-001");

    act(() => {
      result.current.handleOrderChange("order-1");
    });

    expect(result.current.selectedOrderId).toBe("order-1");
    expect(result.current.orderItems).toHaveLength(2);
    expect(result.current.orderItems[0].itemName).toBe("Speaker");
    expect(result.current.orderItems[0].category).toBe("Sound System");

    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);
  });

  it("should read the category from the rental order transaction items", () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));

    expect(result.current.orderItems.map((item) => item.category)).toEqual(["Sound System", "-"]);
  });

  it("should populate initial values in edit mode and submit update", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: EditRoute });

    await waitFor(() => {
      expect(result.current.selectedOrderId).toBe("order-1");
    });

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.returnNotes).toBe("Test notes");
    expect(result.current.returnItemIds).toContain("entry-1");

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "return-1",
        body: expect.objectContaining({
          order_id: "order-1",
          notes: "Test notes",
          status: 1,
        }),
      }),
    );
  });

  it("should validate and submit in create mode with optional photos and remarks", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.errorMessage).toBe("Please select a rental order first.");

    act(() => {
      result.current.handleOrderChange("order-1");
    });
    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);

    await act(async () => {
      await result.current.onCaptureItem(result.current.orderItems[0].id, [new File(["photo"], "photo.jpg", { type: "image/jpeg" })]);
      result.current.handleNotesChange("Catatan kembalian");
    });
    expect(result.current.photoPreview).toEqual({ itemId: "item-1-0", itemName: "Speaker", url: "blob:preview" });
    expect(mockUpload).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.errorMessage).toBe("Confirm or discard photo before saving.");
    expect(mockCreate).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.confirmPhoto();
    });
    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);
    expect(result.current.stagedPhotoUrls.get("item-1-0")).toEqual(["blob:preview"]);
    expect(mockUpload).not.toHaveBeenCalled();
    expect(mockRevokeObjectURL).not.toHaveBeenCalledWith("blob:preview");

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpload).toHaveBeenCalledTimes(1);
    const uploadedForm = mockUpload.mock.calls[0][0];
    expect(uploadedForm).toBeInstanceOf(FormData);
    expect(uploadedForm.get("file")).toBeInstanceOf(File);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:preview");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: "order-1",
        notes: "Catatan kembalian",
        status: 1,
        return_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4} 12:00:00$/),
        items: [
          {
            item_id: "item-1",
            qty: 2,
            condition: "Good",
            notes: "",
            file_url: "/photos/return.jpg",
            file_name: "return.jpg",
            images: [{ file_url: "/photos/return.jpg", file_name: "return.jpg" }],
            status: 0,
          },
          {
            item_id: "item-2",
            qty: 1,
            condition: "Good",
            notes: "",
            file_url: "",
            file_name: "",
            images: [],
            status: 0,
          },
        ],
      }),
    );
  });

  it("should save return without photos or remarks when both are omitted", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => {
      result.current.handleOrderChange("order-1");
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpload).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: "order-1",
        notes: "",
        status: 1,
        return_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4} 12:00:00$/),
        items: [
          { item_id: "item-1", qty: 2, condition: "Good", notes: "", file_url: "", file_name: "", images: [], status: 0 },
          { item_id: "item-2", qty: 1, condition: "Good", notes: "", file_url: "", file_name: "", images: [], status: 0 },
        ],
      }),
    );
  });

  it("should retain staged photo and skip return POST when upload fails, then retry", async () => {
    mockUpload.mockReturnValueOnce({ unwrap: () => Promise.reject(new Error("Upload failed")) });
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));

    await act(async () => {
      await result.current.onCaptureItem(result.current.orderItems[0].id, [new File(["photo"], "photo.jpg", { type: "image/jpeg" })]);
    });
    act(() => result.current.confirmPhoto());

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);
    expect(result.current.stagedPhotoUrls.get("item-1-0")).toEqual(["blob:preview"]);
    expect(result.current.errorMessage).toBe("Upload failed");
    expect(mockCreate).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleSave();
    });
    expect(mockUpload).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("should send edited item remark through notes payload on save", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));
    act(() => result.current.onItemNotesChange("item-1-0", "Case dented"));

    await act(async () => {
      await result.current.onCaptureItem("item-1-0", [new File(["photo"], "photo.jpg", { type: "image/jpeg" })]);
    });
    act(() => result.current.confirmPhoto());
    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      items: [
        expect.objectContaining({ item_id: "item-1", notes: "Case dented", file_url: "/photos/return.jpg", images: [{ file_url: "/photos/return.jpg", file_name: "return.jpg" }] }),
        expect.objectContaining({ item_id: "item-2", notes: "", file_url: "", images: [] }),
      ],
    }));
  });

  it("should upload multiple staged photos sequentially on save before creating return", async () => {
    mockUpload
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ url: "/photos/item-1.jpg", file_name: "item-1.jpg" }) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ url: "/photos/item-2.jpg", file_name: "item-2.jpg" }) });

    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));

    await act(async () => {
      await result.current.onCaptureItem("item-1-0", [new File(["photo1"], "photo1.jpg", { type: "image/jpeg" })]);
    });
    act(() => result.current.confirmPhoto());

    await act(async () => {
      await result.current.onCaptureItem("item-2-1", [new File(["photo2"], "photo2.jpg", { type: "image/jpeg" })]);
    });
    act(() => result.current.confirmPhoto());

    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);
    expect(mockUpload).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpload).toHaveBeenCalledTimes(2);
    expect(mockUpload.mock.invocationCallOrder[0]).toBeLessThan(mockUpload.mock.invocationCallOrder[1]);
    expect(mockUpload.mock.invocationCallOrder[1]).toBeLessThan(mockCreate.mock.invocationCallOrder[0]);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: "order-1",
        items: [
          expect.objectContaining({ item_id: "item-1", file_url: "/photos/item-1.jpg", file_name: "item-1.jpg", images: [{ file_url: "/photos/item-1.jpg", file_name: "item-1.jpg" }] }),
          expect.objectContaining({ item_id: "item-2", file_url: "/photos/item-2.jpg", file_name: "item-2.jpg", images: [{ file_url: "/photos/item-2.jpg", file_name: "item-2.jpg" }] }),
        ],
      }),
    );
  });

  it("should upload every photo picked for one item and send both urls", async () => {
    mockUpload
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ url: "/photos/a.jpg", file_name: "a.jpg" }) })
      .mockReturnValueOnce({ unwrap: () => Promise.resolve({ url: "/photos/b.jpg", file_name: "b.jpg" }) });

    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));

    await act(async () => {
      await result.current.onCaptureItem("item-1-0", [
        new File(["a"], "a.jpg", { type: "image/jpeg" }),
        new File(["b"], "b.jpg", { type: "image/jpeg" }),
      ]);
    });
    act(() => result.current.confirmPhoto());

    expect(result.current.stagedPhotoUrls.get("item-1-0")).toHaveLength(2);

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpload).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            item_id: "item-1",
            file_url: "/photos/a.jpg",
            file_name: "a.jpg",
            images: [
              { file_url: "/photos/a.jpg", file_name: "a.jpg" },
              { file_url: "/photos/b.jpg", file_name: "b.jpg" },
            ],
          }),
        ]),
      }),
    );
  });

  it("should open staged photo in modal state and close it without uploading", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));

    await act(async () => {
      await result.current.onCaptureItem("item-1-0", [new File(["photo"], "photo.jpg", { type: "image/jpeg" })]);
    });
    act(() => result.current.confirmPhoto());
    act(() => result.current.openPhoto("item-1-0"));

    expect(result.current.viewedPhoto).toEqual({ itemName: "Speaker", url: "blob:preview" });
    expect(mockUpload).not.toHaveBeenCalled();
    act(() => result.current.closeViewedPhoto());
    expect(result.current.viewedPhoto).toBeNull();
  });

  it("should discard preview without uploading", async () => {
    const { result } = renderHook(() => useItemReturnCreate(), { wrapper: CreateRoute });
    act(() => result.current.handleOrderChange("order-1"));
    await act(async () => {
      await result.current.onCaptureItem(result.current.orderItems[0].id, [new File(["photo"], "photo.jpg", { type: "image/jpeg" })]);
    });

    act(() => result.current.closePhotoPreview());
    expect(result.current.photoPreview).toBeNull();
    expect(result.current.stagedPhotoUrls.size).toBe(0);
    expect(result.current.returnItemIds).toEqual(["item-1-0", "item-2-1"]);
    expect(mockUpload).not.toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });
});