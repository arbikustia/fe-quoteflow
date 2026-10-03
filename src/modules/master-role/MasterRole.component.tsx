import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { RoleActionProps, RoleFormModalProps, RoleToolbarProps, MasterRoleProps } from "./MasterRole.type";
import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

/**
 * Status badge
 * @param { status: string } props - props
 * @returns {React.ReactElement} badge
 */
const StatusBadge = ({ status }: { status: string }): React.ReactElement => (
  <span className={status === "active" ? "px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700" : "px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500"}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

/**
 * Form modal
 * @param {RoleFormModalProps} props - props
 * @returns {React.ReactElement} modal
 */
const RoleFormModal = ({ isOpen, onClose, editingRole, onSubmit }: RoleFormModalProps): React.ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingRole ? "Edit Role" : "Create New Role"}>
    <form key={editingRole?.id || "create"} className="space-y-4" onSubmit={onSubmit}>
      <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Role Name</label>
          <input type="text" required defaultValue={editingRole?.roleName as unknown as string} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter role name" />
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark transition-all">{editingRole ? "Save Changes" : "Save Role"}</button>
      </div>
    </form>
  </Modal>
);

/**
 * Toolbar
 * @param {RoleToolbarProps} props - props
 * @returns {React.ReactElement} toolbar
 */
const RoleToolbar = ({ pageSize, totalCount, changePageSize }: RoleToolbarProps): React.ReactElement => (
  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative w-full sm:w-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
      <input type="text" placeholder="Search role" className="w-full sm:w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium" />
    </div>
    <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
  </div>
);

/**
 * Action buttons
 * @param {RoleActionProps} props - props
 * @returns {React.ReactElement} buttons
 */
export const RoleActionButtons = ({ row, onEdit, onConfirm }: RoleActionProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
    <button onClick={() => onConfirm(row)} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
  </div>
);

/**
 * Master Role Component
 * @param {MasterRoleProps} props - props
 * @returns {React.ReactElement} component
 */
export const MasterRoleComponent = (props: MasterRoleProps): React.ReactElement => {
  const { isModalOpen, isConfirmModalOpen, editingRole, deletingRole, openCreateModal, closeModal, closeConfirmModal, onConfirmDelete, currentPage, totalPages, pageSize, paginatedData, goToPage, nextPage, prevPage, changePageSize, totalCount, columns, onSubmit } = props;
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Role Management</span>
          <button onClick={openCreateModal} className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer w-full sm:w-auto">Create Role</button>
        </div>
        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          <RoleToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />
          <div className="flex-1 overflow-auto w-full overflow-x-auto"><Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} /></div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
        </div>
      </div>
      <RoleFormModal isOpen={isModalOpen} onClose={closeModal} editingRole={editingRole} onSubmit={onSubmit} />
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={onConfirmDelete} title="Delete Role" message={`Are you sure you want to delete role "${deletingRole?.roleName}"?`} />
    </Layout>
  );
};
