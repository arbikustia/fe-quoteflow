
import type { UserData } from '../desktop-master-user/DesktopMasterUser.type';
export type MobileMasterUserDetailProps = {
  readonly user: UserData | null;
  readonly showConfirm: boolean;
  readonly onNavigateBack: () => void;
  readonly onNavigateEdit: () => void;
  readonly setShowConfirm: (show: boolean) => void;
  readonly handleDelete: () => void;
};

export type DeleteConfirmModalProps = {
  readonly username: string;
  readonly showConfirm: boolean;
  readonly setShowConfirm: (show: boolean) => void;
  readonly handleDelete: () => void;
};

export type UserInfoCardProps = {
  readonly user: UserData;
};

export type DetailHeaderProps = {
  readonly onNavigateBack: () => void;
  readonly onNavigateEdit: () => void;
};

export type ProfileCardProps = {
  readonly username: string;
  readonly role: string;
};
