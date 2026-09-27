import * as React from "react";
import Layout from "../../app/layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import type { MasterUserProps, UserData } from "./MasterUser.type";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Icons } from "../../components/Icons";
import { MOCK_USERS } from "../../fixture/master-user";
import { usePagination } from "../../hooks/usePagination";
import {
  PaginationHeader,
  PaginationFooter,
} from "../../components/Pagination";

/**
 * Render Master User Component
 * @param {MasterUserProps} props - component props
 * @returns {React.ReactElement} - MasterUserComponent
 */
export const MasterUserComponent = (
  props: MasterUserProps,
): React.ReactElement => {
  const {
    isModalOpen,
    isConfirmModalOpen,
    editingUser,
    deletingUser,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  } = props;

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    totalCount,
  } = usePagination(MOCK_USERS);

  const columns: TableColumn<UserData>[] = [
    {
      key: "no",
      header: "No",
      align: "center",
      render: (_, index) => (
        <span className="text-brand-text-medium font-medium text-sm">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    { key: "username", header: "Username" },
    { key: "role", header: "Role" },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
            title="Edit User"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openConfirmModal(row)}
            className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer"
            title="Delete User"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">
            User Management
          </span>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer"
          >
            Create User
          </button>
        </div>

        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? "Edit User" : "Create New User"}
      >
        <form
          key={editingUser?.id || "create"}
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">
              Username
            </label>
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
              {editingUser
                ? "New Password (leave blank to keep current)"
                : "Password"}
            </label>
            <input
              type="password"
              required={!editingUser}
              className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">
              Role
            </label>
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
          <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
            <button
              type="button"
              onClick={closeModal}
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
