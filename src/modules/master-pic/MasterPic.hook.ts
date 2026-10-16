import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PICS } from "../../fixture/master-pic";
import { usePagination } from "../../hooks/usePagination";

import type { MasterPicContainerState, MasterPicNavigation, MasterPicPagination, PicData } from "./MasterPic.type";

/** Hook for master PIC navigation. */
export const useMasterPicNavigation = (): MasterPicNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-pic/create"); };
  const goEdit = (pic: PicData): void => { navigate(`/master-pic/edit/${pic.id}`); };
  const goDetail = (pic: PicData): void => { navigate(`/master-pic/detail/${pic.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/** Hook for local PIC search and pagination. */
export const useMasterPicPagination = (): MasterPicPagination => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = useMemo(() => MOCK_PICS.filter((pic) => pic.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const pagination = usePagination(filteredData, 10);
  const handleSearchTerm = (value: string): void => { setSearchTerm(value); };

  return { ...pagination, setSearchTerm: handleSearchTerm, isEmpty: filteredData.length === 0 };
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
