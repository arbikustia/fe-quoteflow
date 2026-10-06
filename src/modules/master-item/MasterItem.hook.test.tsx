import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMasterItemState } from "./MasterItem.hook";
import type { ItemData } from "./MasterItem.type";

const mockItem: ItemData = { id: "1", name: "Speaker", category: "Audio", price: 5000000, stock: 12, image: "https://example.com/a.jpg", duration: "3 days", remark: "ok", unit: "unit", status: "active", createAt: "2024-01-01", createBy: "Admin" };

describe("useMasterItemState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("initial state", () => {
    const { result } = renderHook(() => useMasterItemState());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
    expect(result.current.isConfirmModalOpen).toBe(false);
    expect(result.current.deletingItem).toBeNull();
  });

  it("openCreateModal and closeModal", () => {
    const { result } = renderHook(() => useMasterItemState());
    act(() => result.current.openCreateModal());
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingItem).toBeNull();
    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.editingItem).toBeNull();
  });

  it("openEditModal sets editingItem", () => {
    const { result } = renderHook(() => useMasterItemState());
    act(() => result.current.openEditModal(mockItem));
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingItem).toEqual(mockItem);
    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.editingItem).toBeNull();
  });

  it("openConfirmModal and closeConfirmModal", () => {
    const { result } = renderHook(() => useMasterItemState());
    act(() => result.current.openConfirmModal(mockItem));
    expect(result.current.isConfirmModalOpen).toBe(true);
    expect(result.current.deletingItem).toEqual(mockItem);
    act(() => result.current.closeConfirmModal());
    expect(result.current.isConfirmModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.deletingItem).toBeNull();
  });

  it("onConfirmDelete closes confirm modal", () => {
    const { result } = renderHook(() => useMasterItemState());
    act(() => result.current.openConfirmModal(mockItem));
    expect(result.current.isConfirmModalOpen).toBe(true);
    act(() => result.current.onConfirmDelete());
    expect(result.current.isConfirmModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.deletingItem).toBeNull();
  });
});
