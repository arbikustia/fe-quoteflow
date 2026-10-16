import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapPic, useGetPicsQuery } from "@/services/master-pic.service";

import type { MasterPicContainerState, MasterPicNavigation, MasterPicPagination, PicData } from "./MasterPic.type";

/** Hook for master PIC navigation. */
export const useMasterPicNavigation = (): MasterPicNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-pic/create"); };
  const goEdit = (pic: PicData): void => {
    navigate(`/master-pic/edit/${pic.id}`, { state: { pic } });
  };
  const goDetail = (pic: PicData): void => { navigate(`/master-pic/detail/${pic.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/** Hook for API PIC search and pagination. */
export const useMasterPicPagination = (): MasterPicPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useGetPicsQuery({
    PageNumber: currentPage,
    PageSize: pageSize,
    SearchTerm: searchTerm || undefined,
  });
  const paginatedData = data?.data.map(mapPic) ?? [];
  const totalCount = data?.total_count ?? 0;
  const totalPages = Math.max(1, data?.total_pages ?? 1);
  const goToPage = (page: number): void => { setCurrentPage(Math.max(1, Math.min(page, totalPages))); };
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  const nextPage = (): void => { goToPage(currentPage + 1); };
  const prevPage = (): void => { goToPage(currentPage - 1); };
  const handleSearchTerm = (value: string): void => { setSearchTerm(value); setCurrentPage(1); };

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    totalCount,
    isEmpty: !isLoading && paginatedData.length === 0,
    isLoading,
    isError,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};

/** Hook for master PIC container state. */
export const useMasterPicContainerState = (): MasterPicContainerState => {
  const pagination = useMasterPicPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const goDelete = (): void => { setIsMoreOpen(false); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
