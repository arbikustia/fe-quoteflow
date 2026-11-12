import { act, renderHook } from "@/libs/unit-test";
import { useNavigate, useParams } from "react-router-dom";

import { useGetRentalChecklistByIdQuery } from "@/services/rental-checklist.service";
import { useGetRentalOrderOptionsQuery } from "@/services/rental-order.service";

import { useItemChecklistDetail } from "./ItemChecklistDetail.hook";
import { downloadChecklistPdf } from "../ItemChecklist.pdf";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/rental-checklist.service", () => ({
  useGetRentalChecklistByIdQuery: jest.fn(),
}));

jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrderOptionsQuery: jest.fn(),
}));

jest.mock("../ItemChecklist.pdf", () => ({
  downloadChecklistPdf: jest.fn(),
}));

const checklist = {
  id: "checklist-1",
  order_id: "order-1",
  checklist_no: "CHECK-1",
  checklist_date: "2026-11-01",
  status: 1,
  created_at: "2026-11-01",
  updated_at: "2026-11-01",
  items: [],
};
const order = { id: "order-1" };

const mockQueries = (): void => {
  jest.mocked(useGetRentalChecklistByIdQuery).mockReturnValue({ data: { status: true, messages: [], data: checklist }, isLoading: false } as never);
  jest.mocked(useGetRentalOrderOptionsQuery).mockReturnValue({ data: { status: true, data: [order] } } as never);
};

describe("useItemChecklistDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useParams).mockReturnValue({ id: "checklist-1" });
    jest.mocked(useNavigate).mockReturnValue(jest.fn());
    mockQueries();
  });

  it("should expose checklist and navigate between checklist pages", () => {
    const navigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(navigate);
    const { result } = renderHook(useItemChecklistDetail);

    act(() => {
      result.current.goBack();
      result.current.goEdit();
    });

    expect(result.current.checklist).toBe(checklist);
    expect(navigate).toHaveBeenNthCalledWith(1, "/item-checklist");
    expect(navigate).toHaveBeenNthCalledWith(2, "/item-checklist/create/checklist-1");
  });

  it("should download checklist with its rental order", () => {
    const { result } = renderHook(useItemChecklistDetail);

    act(() => result.current.onDownload());

    expect(downloadChecklistPdf).toHaveBeenCalledWith(checklist, order);
  });

  it("should alert when rental order is unavailable", () => {
    const alert = jest.spyOn(window, "alert").mockImplementation(() => undefined);
    jest.mocked(useGetRentalOrderOptionsQuery).mockReturnValue({ data: { status: true, data: [] } } as never);
    const { result } = renderHook(useItemChecklistDetail);

    act(() => result.current.onDownload());

    expect(alert).toHaveBeenCalledWith("Unable to download item checklist. Rental order data is unavailable.");
    expect(downloadChecklistPdf).not.toHaveBeenCalled();
    alert.mockRestore();
  });

  it("should report invalid route and unsuccessful response", () => {
    jest.mocked(useParams).mockReturnValue({});
    let rendered = renderHook(useItemChecklistDetail);
    expect(rendered.result.current.errorMessage).toBe("Unable to load item checklist.");

    jest.mocked(useParams).mockReturnValue({ id: "checklist-1" });
    jest.mocked(useGetRentalChecklistByIdQuery).mockReturnValue({ data: { status: false, messages: ["Not found"], data: checklist }, isLoading: false } as never);
    rendered = renderHook(useItemChecklistDetail);

    expect(rendered.result.current.errorMessage).toBe("Not found");
  });
});
