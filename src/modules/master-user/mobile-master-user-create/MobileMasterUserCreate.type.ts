
import type { UserData } from '../desktop-master-user/DesktopMasterUser.type';
export type MobileMasterUserCreateProps = {
  readonly existingUser: UserData | null;
  readonly isEdit: boolean;
  readonly onNavigateBack: () => void;
  readonly onSubmit: (e: React.SyntheticEvent) => void;
};

export type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  defaultValue?: string;
  required?: boolean;
};

export type RoleSelectProps = {
  readonly defaultValue?: string;
};
