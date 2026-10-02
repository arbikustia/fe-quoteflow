import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import type {
  CategoryActionProps,
  CategoryFormModalProps,
  CategoryToolbarProps,
  DesktopMasterCategoryProps,
} from "./DesktopMasterCategory.type";
import Layout from "../../../app/layout";
import ConfirmModal from "../../../components/ConfirmModal";
import { Icons } from "../../../components/Icons";
import Modal from "../../../components/Modal";
import {
  PaginationFooter,
  PaginationHeader,
} from "../../../components/Pagination";
import Table from "../../../components/Table";

/**
 * Render Category Form Modal Component
 * @param {CategoryFormModalProps} props - component props
 * @returns {React.ReactElement} modal element
 */
const _CategoryFormModal = ({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
}: CategoryFormModalProps): React.ReactElement => {
  const formKey = editingCategory?.id || "create";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingCategory ? "Edit Category" : "Create New Category"}>
      <form key={formKey} className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Category Name</label>
          <input type="text" required defaultValue={editingCategory?.categoryName} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter category name" />
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all">{editingCategory ? "Save Changes" : "Save Category"}</button>
        </div>
      </form>
    </Modal>
  );
};

/**
 * Render Category Toolbar Component
 * @param {CategoryToolbarProps} props - component props
 * @returns {React.ReactElement} toolbar element
 */
const _CategoryToolbar = ({ pageSize, totalCount, changePageSize }: CategoryToolbarProps): React.ReactElement => {
  return (
    <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
          <Icons.Search />
        </div>
        <input type="text" placeholder="Search category" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium" />
      </div>
      <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
    </div>
  );
};


/**
 * Render action buttons
 * @param {CategoryActionProps} props - component props
 * @returns {React.ReactElement} action buttons
 */
export const CategoryActionButtons = ({ row, onEdit, onConfirm }: CategoryActionProps): React.ReactElement => {
  /**
   * Handle edit
   * @returns {void} - void
   */
  const handleEdit = (): void => {
    onEdit(row);
  };

  const handleConfirm = (): void => {
    onConfirm(row);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={handleEdit} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Category">
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button onClick={handleConfirm} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Category">
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};



/**
 * Render Master Category Component
 * @param {DesktopMasterCategoryProps} props - component props
 * @returns {React.ReactElement} - DesktopMasterCategoryComponent
 */
export const DesktopMasterCategoryComponent = (
  props: DesktopMasterCategoryProps,
): React.ReactElement => {
  const { isModalOpen, isConfirmModalOpen, editingCategory, deletingCategory, openCreateModal, closeModal, closeConfirmModal, onConfirmDelete, currentPage, totalPages, pageSize, paginatedData, goToPage, nextPage, prevPage, changePageSize, totalCount, columns, onSubmit } = props;

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Category Management</span>
          <button onClick={openCreateModal} className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer">
            Create Category
          </button>
        </div>
        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          <_CategoryToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />
          <div className="flex-1 overflow-auto">
            <Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} />
          </div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
        </div>
      </div>
      <_CategoryFormModal isOpen={isModalOpen} onClose={closeModal} editingCategory={editingCategory} onSubmit={onSubmit} />
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={onConfirmDelete} title="Delete Category" message={`Are you sure you want to delete category "${deletingCategory?.categoryName}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" isDestructive={true} />
    </Layout>
  );
};
