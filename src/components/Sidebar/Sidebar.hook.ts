import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useSidebarState = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const onToggleMenu = (menuName: string) => {
    setOpenMenus((prev) => 
      prev.includes(menuName) 
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  return {
    currentPath: location.pathname,
    openMenus,
    onToggleMenu,
  };
};
