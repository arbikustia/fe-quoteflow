import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import type { MasterUserProps, UserData } from "./MasterUser.type";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Dummy data for now
const DUMMY_DATA: UserData[] = [
  { id: "1", username: "arbikustia14", role: "Admin" },
  { id: "2", username: "johndoe", role: "User" },
];

/**
 * Render Master User Component
 * @param {MasterUserProps} props - component props
 * @returns {React.ReactElement} - MasterUserComponent
 */
export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  const { 
    isModalOpen, isConfirmModalOpen, editingUser, deletingUser,
    openCreateModal, openEditModal, closeModal, 
    openConfirmModal, closeConfirmModal, onConfirmDelete 
  } = props;

  const columns: TableColumn<UserData>[] = [
    { key: "username", header: "Username" },
    { key: "role", header: "Role" },
    { 
      key: "actions", 
      header: "Actions", 
      align: "right",
      render: (row) => (
        <div className="flex gap-3 justify-end pr-6">
          <button 
            onClick={() => openEditModal(row)}
            className="flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-dark hover:bg-brand-blue/10 px-3 py-1.5 rounded-lg font-bold text-sm transition-all focus:outline-none"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
          <button 
            onClick={() => openConfirmModal(row)}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold text-sm transition-all focus:outline-none"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Master User">
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-text-dark">User Management</h2>
          <button 
            onClick={openCreateModal}
            className="px-4 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all"
          >
            + Add User
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden bg-white rounded-2xl border border-gray-100/50 shadow-sm">
          <Table 
            data={DUMMY_DATA} 
            columns={columns} 
            keyExtractor={(row) => row.id} 
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? "Edit User" : "Create New User"}>
        <form key={editingUser?.id || "create"} className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Username</label>
            <input 
              type="text" 
              required
              defaultValue={editingUser?.username}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">
              {editingUser ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <input 
              type="password" 
              required={!editingUser}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Role</label>
            <select 
              required
              defaultValue={editingUser?.role || ""}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={closeModal}
              className="px-4 py-2 text-brand-text-medium font-bold hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all"
            >
              {editingUser ? "Save Changes" : "Save User"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={onConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${deletingUser?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </Layout>
  );
};
