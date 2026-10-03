import * as React from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import type { CustomerData, CustomerFormModalProps, MasterCustomerProps } from "./MasterCustomer.type";
import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

const _CustomerFormModal = ({ isOpen, onClose, editingCustomer, onSubmit }: CustomerFormModalProps): React.ReactElement => {
  const formKey = editingCustomer?.id || "create";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingCustomer ? "Edit Customer" : "Create New Customer"}>
      <form key={formKey} className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Customer Name</label>
          <input type="text" name="name" required defaultValue={editingCustomer?.name} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter customer name" />
        </div>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Address</label>
          <textarea name="address" required defaultValue={editingCustomer?.address} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter address" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-1">Phone Number</label>
          <input type="tel" name="phoneNumber" required defaultValue={editingCustomer?.phoneNumber} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all" placeholder="Enter phone number" />
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark transition-all">{editingCustomer ? "Save Changes" : "Save Customer"}</button>
        </div>
      </form>
    </Modal>
  );
};

export const CustomerActionButtons = ({ row, onEdit, onConfirm }: { row: CustomerData; onEdit: (c: CustomerData) => void; onConfirm: (c: CustomerData) => void }): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
    <button onClick={() => onConfirm(row)} className="p-2 text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
  </div>
);

export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  return (
    <Layout pageTitle="Master Customer">
      <div className="p-4 md:p-8">
        <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-gray-light overflow-hidden">
          <div className="p-6 border-b border-brand-gray-light flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text-dark">Customer List</h2>
              <p className="text-sm text-brand-text-medium">Manage your customer data and information</p>
            </div>
            <button onClick={props.openCreateModal} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-brand-white font-bold rounded-2xl shadow-md hover:bg-brand-blue-dark transition-all">
              <FiPlus /> <span>Add Customer</span>
            </button>
          </div>
          
          <div className="p-6 border-b border-brand-gray-light">
             <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-medium" />
                <input type="text" placeholder="Search customer..." className="w-full pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20" />
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

      <_CustomerFormModal isOpen={props.isModalOpen} onClose={props.closeModal} editingCustomer={props.editingCustomer} onSubmit={props.onSubmit} />
      
      <ConfirmModal isOpen={props.isConfirmModalOpen} onClose={props.closeConfirmModal} onConfirm={props.onConfirmDelete} title="Delete Customer" message={`Are you sure you want to delete customer "${props.deletingCustomer?.name}"? This action cannot be undone.`} />
    </Layout>
  );
};
