
import * as React from "react";

import type { DeleteConfirmModalProps, DetailHeaderProps, MobileMasterUserDetailProps, ProfileCardProps, UserInfoCardProps } from "./MobileMasterUserDetail.type";

/**
 * Get role styles
 * @param {string} role - user role
 * @returns {string} role styles class
 */
const getRoleStyles = (role: string): string => {
  if (role === "Admin") return "text-[#4a64b8] bg-[#daeaf3]";

  if (role === "User") return "text-[#4a7246] bg-[#e7efdd]";

  return "text-gray-600 bg-gray-100";
};

/**
 * Render Detail Header
 * @param {DetailHeaderProps} props - header props
 * @returns {React.ReactElement} Detail Header Component
 */
const DetailHeader = ({ onNavigateBack, onNavigateEdit }: DetailHeaderProps): React.ReactElement => (
  <div className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
    <button type="button" onClick={onNavigateBack} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </div>
      <span className="font-bold text-[15px]">Back</span>
    </button>
    <button onClick={onNavigateEdit} className="px-5 py-2.5 bg-[#daeaf3] text-[#4a64b8] font-bold text-[13px] rounded-full hover:bg-[#c5dff0] transition-colors">
      Edit User
    </button>
  </div>
);

/**
 * Render Profile Card
 * @param {ProfileCardProps} props - profile card props
 * @returns {React.ReactElement} Profile Card Component
 */
const ProfileCard = ({ username, role }: ProfileCardProps): React.ReactElement => (
  <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center">
    <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-md">
      <img src={`https://ui-avatars.com/api/?name=${username}&background=random&size=150`} alt={username} className="w-full h-full object-cover" />
    </div>
    <h2 className="text-[26px] font-extrabold text-gray-900 leading-none mb-2">{username}</h2>
    <div className={`mt-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase ${getRoleStyles(role)}`}>
      {role}
    </div>
  </div>
);

/**
 * Render User Info Card
 * @param {UserInfoCardProps} props - card props
 * @returns {React.ReactElement} User Info Card Component
 */
const UserInfoCard = ({ user }: UserInfoCardProps): React.ReactElement => (
  <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100">
    <h3 className="text-[14px] font-bold text-gray-400 tracking-widest uppercase mb-6">User Information</h3>
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">User ID</span>
        <p className="font-semibold text-gray-800 text-[15px]">{user.id}</p>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Username</span>
        <p className="font-semibold text-gray-800 text-[15px]">{user.username}</p>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">Status</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="font-semibold text-gray-800 text-[15px]">Active</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Render Delete Confirm Modal
 * @param {DeleteConfirmModalProps} props - modal props
 * @returns {React.ReactElement | null} Modal Component
 */
const DeleteConfirmModal = ({ username, showConfirm, setShowConfirm, handleDelete }: DeleteConfirmModalProps): React.ReactElement | null => {
  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-[#fde8e8] rounded-full flex items-center justify-center mb-4 mx-auto text-[#bd4040]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3 className="text-[22px] font-bold text-center text-gray-900 mb-2">Delete User?</h3>
        <p className="text-[14px] text-gray-500 text-center mb-8 font-medium">Are you sure you want to delete <span className="text-gray-900 font-bold">{username}</span>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setShowConfirm(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} className="flex-1 py-3.5 bg-[#bd4040] text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Render Mobile Master User Detail Component
 * @param {MobileMasterUserDetailProps} props - mobile master user detail props
 * @returns {React.ReactElement} Mobile Master User Detail Component
 */
export const MobileMasterUserDetailComponent = (props: MobileMasterUserDetailProps): React.ReactElement => {
  const { user, showConfirm, onNavigateBack, onNavigateEdit, setShowConfirm, handleDelete } = props;

  if (!user) {
    return (
      <div className="flex-1 w-full min-h-full bg-[#f8f9fb] flex items-center justify-center">
        <p className="text-gray-500 font-medium">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans relative overflow-y-auto">
      <DetailHeader onNavigateBack={onNavigateBack} onNavigateEdit={onNavigateEdit} />
      <div className="px-6 mt-4 pb-24">
        <ProfileCard username={user.username} role={user.role} />
        <UserInfoCard user={user} />
        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full mt-8 bg-[#fde8e8] text-[#bd4040] rounded-full py-4 text-[16px] font-bold tracking-wide shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete User
        </button>
      </div>
      <DeleteConfirmModal username={user.username} showConfirm={showConfirm} setShowConfirm={setShowConfirm} handleDelete={handleDelete} />
    </div>
  );
};
