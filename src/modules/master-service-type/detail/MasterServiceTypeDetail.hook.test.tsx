import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterServiceTypeDetail } from "./MasterServiceTypeDetail.hook";

import { MOCK_SERVICE_TYPES } from "@/fixture/master-service-type";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("MasterServiceTypeDetail.hook", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("should return null serviceType when id is not found", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "non-existent" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    expect(result.current.serviceType).toBeNull();
    expect(result.current.isMoreOpen).toBe(false);
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it("should return serviceType when id matches fixture", () => {
    const targetServiceType = MOCK_SERVICE_TYPES[0];
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: targetServiceType.id });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    expect(result.current.serviceType).toEqual(targetServiceType);
  });

  it("should handle more menu toggle and close", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-1" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.toggleMore();
    });
    expect(result.current.isMoreOpen).toBe(true);

    act(() => {
      result.current.closeMore();
    });
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should handle delete modal open and close", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-1" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.toggleMore();
      result.current.openDeleteModal();
    });
    expect(result.current.isMoreOpen).toBe(false);
    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      result.current.closeDeleteModal();
    });
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it("should navigate back on goBack", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-1" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.goBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should navigate to edit page on goEdit when serviceType exists", () => {
    const targetServiceType = MOCK_SERVICE_TYPES[0];
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: targetServiceType.id });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.goEdit();
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/master-service-type/edit/${targetServiceType.id}`,
      { state: { serviceType: targetServiceType } },
    );
  });

  it("should not navigate on goEdit when serviceType is null", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "missing-id" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.goEdit();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should close modal and navigate to list on handleDelete", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-1" });

    const { result } = renderHook(() => useMasterServiceTypeDetail());

    act(() => {
      result.current.openDeleteModal();
      result.current.handleDelete();
    });

    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith("/master-service-type");
  });
});
