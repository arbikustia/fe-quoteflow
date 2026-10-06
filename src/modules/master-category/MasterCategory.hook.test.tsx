import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMasterCategoryState } from "./MasterCategory.hook";
import type { CategoryData } from "./MasterCategory.type";

const mockCategory: CategoryData = { id: "1", categoryName: "Audio", status: "active", createAt: "2024-02-01", createBy: "Admin" };

describe("useMasterCategoryState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("initial state", () => {
    const { result } = renderHook(() => useMasterCategoryState());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingCategory).toBeNull();
    expect(result.current.isConfirmModalOpen).toBe(false);
    expect(result.current.deletingCategory).toBeNull();
  });

  it("openCreateModal and closeModal", () => {
    const { result } = renderHook(() => useMasterCategoryState());
    act(() => result.current.openCreateModal());
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingCategory).toBeNull();
    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.editingCategory).toBeNull();
  });

  it("openEditModal sets editingCategory", () => {
    const { result } = renderHook(() => useMasterCategoryState());
    act(() => result.current.openEditModal(mockCategory));
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingCategory).toEqual(mockCategory);
    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.editingCategory).toBeNull();
  });

  it("openConfirmModal and closeConfirmModal", () => {
    const { result } = renderHook(() => useMasterCategoryState());
    act(() => result.current.openConfirmModal(mockCategory));
    expect(result.current.isConfirmModalOpen).toBe(true);
    expect(result.current.deletingCategory).toEqual(mockCategory);
    act(() => result.current.closeConfirmModal());
    expect(result.current.isConfirmModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.deletingCategory).toBeNull();
  });

  it("onConfirmDelete closes confirm modal", () => {
    const { result } = renderHook(() => useMasterCategoryState());
    act(() => result.current.openConfirmModal(mockCategory));
    expect(result.current.isConfirmModalOpen).toBe(true);
    act(() => result.current.onConfirmDelete());
    expect(result.current.isConfirmModalOpen).toBe(false);
    act(() => { vi.advanceTimersByTime(250); });
    expect(result.current.deletingCategory).toBeNull();
  });
});
