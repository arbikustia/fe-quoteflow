import * as React from "react";

import { getColumns } from "./MasterItem.columns";
import { MasterItemComponent } from "./MasterItem.component";
import { useMasterItemContainerState } from "./MasterItem.hook";

/**
 * Master Item container
 * @returns {React.ReactElement} Container component
 */
const MasterItemContainer = (): React.ReactElement => {
  const containerState = useMasterItemContainerState();
  const navigation = containerState;
  const pagination = containerState.pagination;

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    selectedItemIds: containerState.selectedItemIds,
    isMultiDownloadMode: containerState.isMultiDownloadMode,
    onToggleItem: containerState.onToggleItem,
    onEdit: navigation.goEdit,
    onDownload: containerState.onDownload,
  });

  return (
    <MasterItemComponent
      {...pagination}
      selectedItemIds={containerState.selectedItemIds}
      isMultiDownloadMode={containerState.isMultiDownloadMode}
      onToggleItem={containerState.onToggleItem}
      onToggleMultiDownload={containerState.onToggleMultiDownload}
      onCancelMultiDownload={containerState.onCancelMultiDownload}
      onDownload={containerState.onDownload}
      onDownloadSelected={containerState.onDownloadSelected}
      columns={columns}
      onBack={navigation.goBack}
      onCreate={navigation.goCreate}
      onEdit={navigation.goEdit}
      onRowClick={navigation.goDetail}
      onMore={containerState.toggleMore}
      isMoreOpen={containerState.isMoreOpen}
      onCloseMore={containerState.handleCloseMore}
      onDelete={containerState.goDelete}
    />
  );
};

export default MasterItemContainer;
