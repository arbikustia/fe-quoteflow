import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type {
  DesktopMasterItemProps,
  ItemActionProps,
  ItemFormFieldsProps,
  ItemFormModalProps,
  ItemToolbarProps,
} from "./DesktopMasterItem.type";
import Layout from "../../../app/layout";
import ConfirmModal from "../../../components/ConfirmModal";
import { Icons } from "../../../components/Icons";
import Modal from "../../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../../components/Pagination";
import Table from "../../../components/Table";
import { MOCK_CATEGORIES } from "../../../fixture/master-category";

const ItemFormFields = ({ editingItem }: ItemFormFieldsProps): React.ReactElement => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Item Name</label>
      <input name="name" type="text" required defaultValue={editingItem?.name} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter item name" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Category</label>
        <select name="category" required defaultValue={editingItem?.category} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark">
          <option value="">Select Category</option>
          {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.categoryName}>{c.categoryName}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Stock</label>
        <input name="stock" type="number" required defaultValue={editingItem?.stock} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Price (Rp)</label>
        <input name="price" type="number" required defaultValue={editingItem?.price} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" />
      </div>
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Duration</label>
        <input name="duration" type="text" required defaultValue={editingItem?.duration} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="e.g. 3 days" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Image URL</label>
      <input name="image" type="text" required defaultValue={editingItem?.image} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="https://..." />
    </div>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Remark</label>
      <textarea name="remark" defaultValue={editingItem?.remark} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[80px]" placeholder="Add notes..." />
    </div>
  </div>
);

const ItemFormModal = ({ isOpen, onClose, editingItem, onSubmit }: ItemFormModalProps): React.ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? "Edit Item" : "Create New Item"}>
    <form key={editingItem?.id || "create"} className="space-y-4" onSubmit={onSubmit}>
      <ItemFormFields editingItem={editingItem} />
      <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all">{editingItem ? "Save Changes" : "Save Item"}</button>
      </div>
    </form>
  </Modal>
);

const ItemToolbar = ({ pageSize, totalCount, changePageSize }: ItemToolbarProps): React.ReactElement => (
  <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
        <Icons.Search />
      </div>
      <input type="text" placeholder="Search item" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium" />
    </div>
    <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
  </div>
);

export const ItemActionButtons = ({ row, onEdit, onConfirm }: ItemActionProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Item"><FiEdit2 className="w-4 h-4" /></button>
    <button onClick={() => onConfirm(row)} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Item"><FiTrash2 className="w-4 h-4" /></button>
  </div>
);

export const DesktopMasterItemComponent = (props: DesktopMasterItemProps): React.ReactElement => {
  const { isModalOpen, isConfirmModalOpen, editingItem, deletingItem, openCreateModal, closeModal, closeConfirmModal, onConfirmDelete, onSubmit, pageSize, totalCount, changePageSize, paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage } = props;
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Item Management</span>
          <button onClick={openCreateModal} className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer">Create Item</button>
        </div>
        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          <ItemToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />
          <div className="flex-1 overflow-auto">
            <Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} />
          </div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
        </div>
      </div>
      <ItemFormModal isOpen={isModalOpen} onClose={closeModal} editingItem={editingItem} onSubmit={onSubmit} />
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={onConfirmDelete} title="Delete Item" message={`Are you sure you want to delete item "${deletingItem?.name}"?`} confirmText="Delete" cancelText="Cancel" isDestructive />
    </Layout>
  );
};
