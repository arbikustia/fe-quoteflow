import type { ItemData } from '../desktop-master-item/DesktopMasterItem.type';

export type MobileHeaderProps = {
  readonly onNavigate: (path: string) => void;
};

export type ItemRowProps = {
  readonly item: ItemData;
  readonly index: number;
  readonly onNavigate: (path: string) => void;
};

export type MobileMasterItemProps = {
  readonly items: ItemData[];
  readonly onNavigate: (path: string) => void;
};
