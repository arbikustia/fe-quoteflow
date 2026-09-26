import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import type { MasterItemProps, ItemData } from "./MasterItem.type";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Dummy data for now
const DUMMY_DATA: ItemData[] = [
  { id: "1", name: "Laptop Dell XPS 15", category: "Electronics", unit: "Pcs", price: 25000000, remark: "High-end laptop" },
  { id: "2", name: "Office Chair", category: "Furniture", unit: "Pcs", price: 1500000, remark: "Ergonomic chair" },
];

/**
 * Render Master Item Component
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} - MasterItemComponent
 */
export const MasterItemComponent = (props: MasterItemProps): React.ReactElement => {
  const { 
    isModalOpen, isConfirmModalOpen, editingItem, deletingItem,
    openCreateModal, openEditModal, closeModal, 
    openConfirmModal, closeConfirmModal, onConfirmDelete 
  } = props;

  const columns: TableColumn<ItemData>[] = [
    { key: "name", header: "Item Name" },
    { key: "category", header: "Category" },
    { key: "unit", header: "Unit" },
    { 
      key: "price", 
      header: "Price",
      render: (row) => `Rp ${row.price.toLocaleString("id-ID")}`
    },
    { key: "remark", header: "Remark" },
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
    <Layout pageTitle="Master Item">
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-text-dark">Item Management</h2>
          <button 
            onClick={openCreateModal}
            className="px-4 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all"
          >
            + Add Item
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? "Edit Item" : "Create New Item"}>
        <form key={editingItem?.id || "create"} className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Item Name</label>
            <input 
              type="text" 
              required
              defaultValue={editingItem?.name}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
              placeholder="Enter item name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-text-dark mb-1">Category</label>
              <select 
                required
                defaultValue={editingItem?.category || ""}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
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
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
                placeholder="e.g. Pcs, Box, Kg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Price (Rp)</label>
            <input 
              type="number" 
              required
              min="0"
              defaultValue={editingItem?.price}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" 
              placeholder="Enter price"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-1">Remark</label>
            <textarea 
              defaultValue={editingItem?.remark}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[80px]" 
              placeholder="Add optional notes..."
            />
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
              {editingItem ? "Save Changes" : "Save Item"}
            </button>
          </div>
        </form>
      </Modal>

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
