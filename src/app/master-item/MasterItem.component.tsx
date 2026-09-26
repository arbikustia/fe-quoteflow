import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import type { MasterItemProps, ItemData } from "./MasterItem.type";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Icons } from "../../components/Icons";
import { MOCK_ITEMS } from "../../fixture/master-item";

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
      header: "Action", 
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => openEditModal(row)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Item"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openConfirmModal(row)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Item"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-gray-900">Item Management</span>
          <button 
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-sm cursor-pointer"
          >
            Create Item
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search item"
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              Showing
              <select className="border border-gray-200 rounded px-2 py-1 bg-white font-medium text-gray-700 focus:outline-none">
                <option>15</option>
                <option>30</option>
                <option>50</option>
              </select>
              of 120 results
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table 
              data={MOCK_ITEMS} 
              columns={columns} 
              keyExtractor={(row) => row.id} 
            />
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {"<"}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {">"}
            </button>
          </div>
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
