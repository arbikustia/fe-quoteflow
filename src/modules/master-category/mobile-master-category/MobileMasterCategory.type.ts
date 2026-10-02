import type { CategoryData } from '../desktop-master-category/DesktopMasterCategory.type';

export type MobileHeaderProps = {
  readonly onNavigate: (path: string) => void;
};

export type CategoryRowProps = {
  readonly category: CategoryData;
  readonly index: number;
  readonly onNavigate: (path: string) => void;
};

export type MobileMasterCategoryProps = {
  readonly categories: CategoryData[];
  readonly onNavigate: (path: string) => void;
};
