import * as React from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import type { ServiceTypeData, ServiceTypeFormModalProps, MasterServiceTypeProps } from "./MasterServiceType.type";
import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

const _ServiceTypeFormModal = ({ isOpen, onClose, editingServiceType, onSubmit }: ServiceTypeFormModalProps): React.ReactElement => {
  const formKey = editingServiceType?.id || "create";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingServiceType ? "Edit Service Type" : "Create New Service Type"}>
      <form key={formKey} className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Service Name</label>
          <input type="text" name="name" required defaultValue={editingServiceType?.name} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter service name" />
        </div>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Price (IDR)</label>
          <input type="number" name="price" required defaultValue={editingServiceType?.price} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter price" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" id="isActive" name="isActive" defaultChecked={editingServiceType ? editingServiceType.isActive : true} className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue/20" />
          <label htmlFor="isActive" className="text-sm font-bold text-brand-text-dark select-none cursor-pointer">Active</label>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark transition-all">{editingServiceType ? "Save Changes" : "Save Service Type"}</button>
        </div>
      </form>
    </Modal>
  );
};

export const ServiceTypeActionButtons = ({ row, onEdit, onConfirm }: { row: ServiceTypeData; onEdit: (s: ServiceTypeData) => void; onConfirm: (s: ServiceTypeData) => void }): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
    <button onClick={() => onConfirm(row)} className="p-2 text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
  </div>
);

export const MasterServiceTypeComponent = (props: MasterServiceTypeProps): React.ReactElement => {
  return (
    <Layout pageTitle="Master Service Type">
      <div className="p-4 md:p-8">
        <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-gray-light overflow-hidden">
          <div className="p-6 border-b border-brand-gray-light flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text-dark">Service Type List</h2>
              <p className="text-sm text-brand-text-medium">Manage service types and pricing</p>
            </div>
            <button onClick={props.openCreateModal} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-brand-white font-bold rounded-2xl shadow-md hover:bg-brand-blue-dark transition-all">
              <FiPlus /> <span>Add Service Type</span>
            </button>
          </div>
          
          <div className="p-6 border-b border-brand-gray-light">
             <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-medium" />
                <input type="text" placeholder="Search service type..." className="w-full pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20" />
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

      <_ServiceTypeFormModal isOpen={props.isModalOpen} onClose={props.closeModal} editingServiceType={props.editingServiceType} onSubmit={props.onSubmit} />
      
      <ConfirmModal isOpen={props.isConfirmModalOpen} onClose={props.closeConfirmModal} onConfirm={props.onConfirmDelete} title="Delete Service Type" message={`Are you sure you want to delete service type "${props.deletingServiceType?.name}"? This action cannot be undone.`} />
    </Layout>
  );
};
