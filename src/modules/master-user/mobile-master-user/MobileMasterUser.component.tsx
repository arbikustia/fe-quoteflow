
import * as React from "react";

import type { UserData } from "../desktop-master-user/DesktopMasterUser.type";

import type { MobileMasterUserProps } from "./MobileMasterUser.type";

/**
 * Get role styles
 * @param {string} role - user role
 * @returns {string} role styles
 */
const getRoleStyles = (role: string): string => {
  if (role === "Admin") return "text-[#4a64b8] bg-[#daeaf3]";

  if (role === "User") return "text-[#4a7246] bg-[#e7efdd]";

  return "text-gray-600 bg-gray-100";
};

/**
 * Render user row
 * @param {object} props - user row props
 * @param {UserData} props.user - user data
 * @param {number} props.index - user index
 * @param {(path: string) => void} props.onNavigate - navigate function
 * @returns {React.ReactElement} UserRow Component
 */
const UserRow = ({ user, index, onNavigate }: { readonly user: UserData; readonly index: number; readonly onNavigate: (path: string) => void }): React.ReactElement => {
  return (
    <div onClick={() => onNavigate(`/master-user/detail/${user.id}`)} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-10 flex items-center justify-start text-gray-500 font-bold text-[14px]">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="font-bold text-[14px] text-gray-800 truncate pr-2">{user.username}</span>
      </div>
      <div className="w-1/3 flex justify-end">
        <div className={`rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase ${getRoleStyles(user.role)}`}>
          {user.role}
        </div>
      </div>
    </div>
  );
};

/**
 * Render Mobile Master User Component
 * @param {MobileMasterUserProps} props - mobile master user props
 * @returns {React.ReactElement} Mobile Master User Component
 */
export const MobileMasterUserComponent = (props: MobileMasterUserProps): React.ReactElement => {
  const { users, onNavigate } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">User List</h2>
            <p className="text-[14px] text-gray-500 font-medium">Manage your system users.</p>
          </div>
          <button 
            onClick={() => onNavigate('/master-user/create')}
            className="w-12 h-12 bg-[#2b2d30] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-10">No</div>
          <div className="flex-1">User Info</div>
          <div className="w-1/3 text-right pr-2">Role</div>
        </div>
        <div className="flex flex-col">
          {users.map((user, index) => (
            <UserRow key={user.id} user={user} index={index} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};
