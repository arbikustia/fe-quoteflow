import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import Layout from "../../../app/layout";
import ConfirmModal from "../../../components/ConfirmModal";
import { Icons } from "../../../components/Icons";
import Modal from "../../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../../components/Pagination";
import Table from "../../../components/Table";

import type {
  MasterUserProps,
  UserActionProps,
  UserFormModalProps,
  UserToolbarProps,
} from "./DesktopMasterUser.type";

/**
 * Render Role Field
 * @param {Pick<UserFormModalProps, "editingUser">} props - props
 * @returns {React.ReactElement} role field
 */
const RoleField = ({ editingUser }: Pick<UserFormModalProps, "editingUser">): React.ReactElement => (
  <div>
    <label className="block text-sm font-bold text-brand-text-dark mb-1">Role</label>
    <select
      required
      defaultValue={editingUser?.role || ""}
      className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
    >
      <option value="">Select a role</option>
      <option value="Admin">Admin</option>
      <option value="User">User</option>
    </select>
  </div>
);

/**
 * Render User Form Fields
 * @param {Pick<UserFormModalProps, "editingUser">} props - props
 * @returns {React.ReactElement} form fields
 */
const UserFormFields = ({ editingUser }: Pick<UserFormModalProps, "editingUser">): React.ReactElement => (
  <>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Username</label>
      <input
        type="text"
        required
        defaultValue={editingUser?.username}
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
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
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
        placeholder="Enter password"
      />
    </div>

    <RoleField editingUser={editingUser} />
  </>
);

/**
 * Render User Form Modal
 * @param {UserFormModalProps} props - props
 * @returns {React.ReactElement} modal
 */
const UserFormModal = ({ isOpen, onClose, editingUser, onSubmit }: UserFormModalProps): React.ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? "Edit User" : "Create New User"}>
    <form key={editingUser?.id || "create"} className="space-y-4" onSubmit={onSubmit}>
      <UserFormFields editingUser={editingUser} />
      <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all"
        >
          {editingUser ? "Save Changes" : "Save User"}
        </button>
      </div>
    </form>
  </Modal>
);

/**
 * Render User Toolbar
 * @param {UserToolbarProps} props - props
 * @returns {React.ReactElement} toolbar
 */
const UserToolbar = ({ pageSize, totalCount, changePageSize }: UserToolbarProps): React.ReactElement => (
  <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
        <Icons.Search />
      </div>
      <input
        type="text"
        placeholder="Search user"
        className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium"
      />
    </div>
    <PaginationHeader
      pageSize={pageSize}
      totalCount={totalCount}
      onPageSizeChange={changePageSize}
    />
  </div>
);

/**
 * Render User Header
 * @param {{ openCreateModal: () => void }} props - props
 * @returns {React.ReactElement} header
 */
const UserHeader = ({ openCreateModal }: { openCreateModal: () => void }): React.ReactElement => (
  <div className="flex justify-between items-center mb-6">
    <span className="text-2xl font-bold text-brand-text-dark">User Management</span>
    <button
      onClick={openCreateModal}
      className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer"
    >
      Create User
    </button>
  </div>
);

/**
 * Render User Table Container
 * @param {MasterUserProps} props - props
 * @returns {React.ReactElement} table container
 */
const DesktopMasterUserTableContainer = ({
  pageSize,
  totalCount,
  changePageSize,
  paginatedData,
  columns,
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
}: MasterUserProps): React.ReactElement => (
  <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
    <UserToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />

    <div className="flex-1 overflow-auto">
      <Table
        data={paginatedData}
        columns={columns}
        keyExtractor={(row) => row.id}
      />
    </div>

    <PaginationFooter
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  </div>
);

/**
 * Render User Action Buttons
 * @param {UserActionProps} props - component props
 * @returns {React.ReactElement} action buttons
 */
export const UserActionButtons = ({ row, onEdit, onConfirm }: UserActionProps): React.ReactElement => {
  /**
   * Handle edit
   * @returns {void} void
   */
  const handleEdit = (): void => onEdit(row);

  /**
   * Handle confirm
   * @returns {void} void
   */
  const handleConfirm = (): void => onConfirm(row);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleEdit}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit User"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleConfirm}
        className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer"
        title="Delete User"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Render Desktop Master User Component
 * @param {MasterUserProps} props - component props
 * @returns {React.ReactElement} - DesktopMasterUserComponent
 */
export const DesktopMasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  const {
    isModalOpen,
    isConfirmModalOpen,
    editingUser,
    deletingUser,
    openCreateModal,
    closeModal,
    closeConfirmModal,
    onConfirmDelete,
    onSubmit,
  } = props;

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <UserHeader openCreateModal={openCreateModal} />
        <DesktopMasterUserTableContainer {...props} />
      </div>

      <UserFormModal isOpen={isModalOpen} onClose={closeModal} editingUser={editingUser} onSubmit={onSubmit} />

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
