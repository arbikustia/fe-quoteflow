import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getColumns } from "./MasterCategory.columns";
import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData } from "./MasterCategory.type";
import { MOCK_CATEGORIES } from "../../fixture/master-category";
import { usePagination } from "../../hooks/usePagination";

const MasterCategoryContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_CATEGORIES);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-category/create"); };
  const goEdit = (c: CategoryData): void => { navigate(`/master-category/edit/${c.id}`); };
  const goDetail = (c: CategoryData): void => { navigate(`/master-category/detail/${c.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterCategoryComponent
      {...pagination}
      columns={columns}
      onBack={goBack}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
      onMore={toggleMore}
      isMoreOpen={isMoreOpen}
      onCloseMore={() => setIsMoreOpen(false)}
      onDelete={goDelete}
    />
  );
};

export default MasterCategoryContainer;
