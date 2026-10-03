import * as React from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import type { UserData, UserFormModalProps, MasterUserProps } from "./MasterUser.type";
import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

const _UserFormModal = ({ isOpen, onClose, editingUser, onSubmit }: UserFormModalProps): React.ReactElement => {
  const formKey = editingUser?.id || "create";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? "Edit User" : "Create New User"}>
      <form key={formKey} className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Username</label>
          <input type="text" name="username" required defaultValue={editingUser?.username} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter username" />
        </div>
        {!editingUser && (
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter password" />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Role</label>
          <select name="role" required defaultValue={editingUser?.role || "User"} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all">
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark transition-all">{editingUser ? "Save Changes" : "Save User"}</button>
        </div>
      </form>
    </Modal>
  );
};

export const UserActionButtons = ({ row, onEdit, onConfirm }: { row: UserData; onEdit: (u: UserData) => void; onConfirm: (u: UserData) => void }): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
    <button onClick={() => onConfirm(row)} className="p-2 text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
  </div>
);

export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  return (
    <Layout pageTitle="Master User">
      <div className="p-4 md:p-8">
        <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-gray-light overflow-hidden">
          <div className="p-6 border-b border-brand-gray-light flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text-dark">User List</h2>
              <p className="text-sm text-brand-text-medium">Manage system users and their roles</p>
            </div>
            <button onClick={props.openCreateModal} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-brand-white font-bold rounded-2xl shadow-md hover:bg-brand-blue-dark transition-all">
              <FiPlus /> <span>Add User</span>
            </button>
          </div>
          
          <div className="p-6 border-b border-brand-gray-light">
             <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-medium" />
                <input type="text" placeholder="Search user..." className="w-full pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20" />
             </div>
          </div>

          <div className="overflow-x-auto">
            <Table data={props.paginatedData} columns={props.columns} keyExtractor={(r) => r.id} />
          </div>

          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <PaginationHeader pageSize={props.pageSize} totalCount={props.totalCount} onPageSizeChange={props.changePageSize} />
            <PaginationFooter currentPage={props.currentPage} totalPages={props.totalPages} onPageChange={props.goToPage} onNextPage={props.nextPage} onPrevPage={props.prevPage} />
          </div>
        </div>
      </div>

      <_UserFormModal isOpen={props.isModalOpen} onClose={props.closeModal} editingUser={props.editingUser} onSubmit={props.onSubmit} />
      
      <ConfirmModal isOpen={props.isConfirmModalOpen} onClose={props.closeConfirmModal} onConfirm={props.onConfirmDelete} title="Delete User" message={`Are you sure you want to delete user "${props.deletingUser?.username}"? This action cannot be undone.`} />
    </Layout>
  );
};
