import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

import type {
  ItemActionProps,
  ItemData,
  ItemFormModalProps,
  ItemToolbarProps,
  MasterItemProps,
} from "./MasterItem.type";

/**
 * Render Item Form Name Field
 * @param {{editingItem: ItemData | null}} props - props
 * @returns {React.ReactElement} fields element
 */
const ItemFormNameField = ({ editingItem }: { editingItem: ItemData | null }): React.ReactElement => (
  <div>
    <label className="block text-sm font-bold text-brand-text-dark mb-1">Item Name</label>
    <input 
      type="text" 
      required
      defaultValue={editingItem?.name}
      className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
      placeholder="Enter item name"
    />
  </div>
);

/**
 * Render Item Form Category Fields
 * @param {{editingItem: ItemData | null}} props - props
 * @returns {React.ReactElement} fields element
 */
const ItemFormCategoryFields = ({ editingItem }: { editingItem: ItemData | null }): React.ReactElement => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Category</label>
      <select 
        required
        defaultValue={editingItem?.category || ""}
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
      >
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Consumables">Consumables</option>
      </select>
    </div>
    
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Unit</label>
      <input 
        type="text" 
        required
        defaultValue={editingItem?.unit}
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
        placeholder="e.g. Pcs, Box, Kg"
      />
    </div>
  </div>
);

/**
 * Render Item Form Details Fields
 * @param {{editingItem: ItemData | null}} props - props
 * @returns {React.ReactElement} fields element
 */
const ItemFormDetailsFields = ({ editingItem }: { editingItem: ItemData | null }): React.ReactElement => (
  <>
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Price (Rp)</label>
      <input 
        type="number" 
        required
        min="0"
        defaultValue={editingItem?.price}
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
        placeholder="Enter price"
      />
    </div>
    
    <div>
      <label className="block text-sm font-bold text-brand-text-dark mb-1">Remark</label>
      <textarea 
        defaultValue={editingItem?.remark}
        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[80px]" 
        placeholder="Add optional notes..."
      />
    </div>
  </>
);

/**
 * Render Item Form Fields
 * @param {{editingItem: ItemData | null}} props - props
 * @returns {React.ReactElement} fields element
 */
const ItemFormFields = ({ editingItem }: { editingItem: ItemData | null }): React.ReactElement => (
  <>
    <ItemFormNameField editingItem={editingItem} />
    <ItemFormCategoryFields editingItem={editingItem} />
    <ItemFormDetailsFields editingItem={editingItem} />
  </>
);

/**
 * Render Item Form Modal
 * @param {ItemFormModalProps} props - component props
 * @returns {React.ReactElement} modal element
 */
const ItemFormModal = ({
  isOpen,
  onClose,
  editingItem,
  onSubmit,
}: ItemFormModalProps): React.ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? "Edit Item" : "Create New Item"}>
    <form key={editingItem?.id || "create"} className="space-y-4" onSubmit={onSubmit}>
      <ItemFormFields editingItem={editingItem} />
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
          {editingItem ? "Save Changes" : "Save Item"}
        </button>
      </div>
    </form>
  </Modal>
);

/**
 * Render Item Toolbar
 * @param {ItemToolbarProps} props - component props
 * @returns {React.ReactElement} toolbar element
 */
const ItemToolbar = ({ pageSize, totalCount, changePageSize }: ItemToolbarProps): React.ReactElement => (
  <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
        <Icons.Search />
      </div>
      <input
        type="text"
        placeholder="Search item"
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
 * Render action buttons
 * @param {ItemActionProps} props - component props
 * @returns {React.ReactElement} action buttons
 */
export const ItemActionButtons = ({ row, onEdit, onConfirm }: ItemActionProps): React.ReactElement => {
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
        title="Edit Item"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleConfirm}
        className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer"
        title="Delete Item"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Render Item Header
 * @param {{openCreateModal: () => void}} props - props
 * @returns {React.ReactElement} header
 */
const ItemHeader = ({ openCreateModal }: { openCreateModal: () => void }): React.ReactElement => (
  <div className="flex justify-between items-center mb-6">
    <span className="text-2xl font-bold text-brand-text-dark">Item Management</span>
    <button 
      onClick={openCreateModal}
      className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer"
    >
      Create Item
    </button>
  </div>
);

/**
 * Render Item Table Container
 * @param {MasterItemProps} props - props
 * @returns {React.ReactElement} table container
 */
const MasterItemTableContainer = ({ 
  pageSize, totalCount, changePageSize,
  paginatedData, columns,
  currentPage, totalPages, goToPage, nextPage, prevPage 
}: MasterItemProps): React.ReactElement => (
  <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
    <ItemToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />

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
 * Render Master Item Component
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} - MasterItemComponent
 */
export const MasterItemComponent = (props: MasterItemProps): React.ReactElement => {
  const { 
    isModalOpen, isConfirmModalOpen, editingItem, deletingItem,
    openCreateModal, closeModal, 
    closeConfirmModal, onConfirmDelete,
    onSubmit
  } = props;

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <ItemHeader openCreateModal={openCreateModal} />
        <MasterItemTableContainer {...props} />
      </div>

      <ItemFormModal isOpen={isModalOpen} onClose={closeModal} editingItem={editingItem} onSubmit={onSubmit} />

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={onConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete item "${deletingItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </Layout>
  );
};
