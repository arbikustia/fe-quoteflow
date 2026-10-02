
import type { UserData } from '../desktop-master-user/DesktopMasterUser.type';
export type MobileMasterUserProps = {
  readonly users: UserData[];
  readonly onNavigate: (path: string) => void;
};
