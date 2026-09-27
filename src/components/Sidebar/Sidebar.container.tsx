import * as React from 'react';

import { SidebarComponent } from './Sidebar.component';
import { NAVIGATION_CONFIG } from './Sidebar.config';
import { useSidebarState } from './Sidebar.hook';

/**
 * Render Sidebar Container
 * @returns {React.ReactElement} - Sidebar Container
 */
const SidebarContainer = (): React.ReactElement => {
  const { currentPath, openMenus, onToggleMenu } = useSidebarState();

  return (
    <SidebarComponent
      navigation={NAVIGATION_CONFIG}
      currentPath={currentPath}
      openMenus={openMenus}
      onToggleMenu={onToggleMenu}
    />
  );
};

export default SidebarContainer;
