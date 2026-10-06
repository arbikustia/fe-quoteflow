import * as React from 'react';

import { SidebarComponent } from './Sidebar.component';
import { NAVIGATION_SECTIONS } from './Sidebar.config';
import { useSidebarState } from './Sidebar.hook';

/**
 * Render Sidebar Container
 * @returns {React.ReactElement} - Sidebar Container
 */
const SidebarContainer = (): React.ReactElement => {
  const {
    currentPath,
    openMenus,
    onToggleMenu,
    isCollapsed,
    onToggleCollapsed,
    isProfileOpen,
    onToggleProfile,
  } = useSidebarState();

  return (
    <SidebarComponent
      navigation={NAVIGATION_SECTIONS}
      currentPath={currentPath}
      openMenus={openMenus}
      onToggleMenu={onToggleMenu}
      isCollapsed={isCollapsed}
      onToggleCollapsed={onToggleCollapsed}
      isProfileOpen={isProfileOpen}
      onToggleProfile={onToggleProfile}
    />
  );
};

export default SidebarContainer;
