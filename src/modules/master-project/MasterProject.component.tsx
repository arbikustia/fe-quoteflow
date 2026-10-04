import * as React from "react";
import { FiEdit2, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import type {
  MasterProjectProps,
  ProjectActionProps,
  ProjectFormModalProps,
  ProjectToolbarProps,
} from "./MasterProject.type";
import Layout from "../../app/layout";
import ConfirmModal from "../../components/ConfirmModal";
import { Icons } from "../../components/Icons";
import Modal from "../../components/Modal";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";
import { MOCK_ITEMS } from "../../fixture/master-item";

const ProjectFormFields = ({ editingProject }: { editingProject: any }): React.ReactElement => {
  const [items, setItems] = React.useState(editingProject?.items || [{ itemId: "", qty: 1 }]);
  
  const addItem = () => setItems([...items, { itemId: "", qty: 1 }]);
  const removeItem = (idx: number) => setItems(items.filter((_: any, i: number) => i !== idx));
  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Project Name</label>
        <input name="name" type="text" required defaultValue={editingProject?.name} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark" placeholder="Enter project name" />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-brand-text-dark">Items</label>
          <button type="button" onClick={addItem} className="text-brand-blue text-sm font-bold flex items-center gap-1 hover:underline"><FiPlus /> Add Item</button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-center">
              <select 
                value={it.itemId} 
                onChange={(e) => updateItem(idx, "itemId", e.target.value)}
                className="flex-1 px-3 py-1.5 bg-brand-gray-light border border-brand-gray-light rounded-lg text-sm"
                required
              >
                <option value="">Select Item</option>
                {MOCK_ITEMS.map(mi => <option key={mi.id} value={mi.id}>{mi.name}</option>)}
              </select>
              <input 
                type="number" 
                value={it.qty} 
                onChange={(e) => updateItem(idx, "qty", parseInt(e.target.value))}
                className="w-20 px-3 py-1.5 bg-brand-gray-light border border-brand-gray-light rounded-lg text-sm"
                min="1"
                required
              />
              <button type="button" onClick={() => removeItem(idx)} className="text-brand-orange hover:bg-brand-orange-light p-1.5 rounded-lg"><FiMinus /></button>
            </div>
          ))}
        </div>
        <input type="hidden" name="items" value={JSON.stringify(items)} />
      </div>

      <div>
        <label className="block text-sm font-bold text-brand-text-dark mb-1">Remark</label>
        <textarea name="remark" defaultValue={editingProject?.remark} className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[80px]" placeholder="Add notes..." />
      </div>
    </div>
  );
};

const ProjectFormModal = ({ isOpen, onClose, editingProject, onSubmit }: ProjectFormModalProps): React.ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingProject ? "Edit Project" : "Create New Project"}>
    <form key={editingProject?.id || "create"} className="space-y-4" onSubmit={onSubmit}>
      <ProjectFormFields editingProject={editingProject} />
      <div className="pt-4 flex justify-end gap-3 border-t border-brand-gray-light mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 text-brand-text-medium font-bold hover:bg-brand-gray-light rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-brand-blue text-brand-white font-bold rounded-xl shadow-md hover:bg-brand-blue-dark hover:shadow-lg transition-all">{editingProject ? "Save Changes" : "Save Project"}</button>
      </div>
    </form>
  </Modal>
);

const ProjectToolbar = ({ pageSize, totalCount, changePageSize }: ProjectToolbarProps): React.ReactElement => (
  <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
        <Icons.Search />
      </div>
      <input type="text" placeholder="Search project" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium" />
    </div>
    <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
  </div>
);

export const ProjectActionButtons = ({ row, onEdit, onConfirm }: ProjectActionProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => onEdit(row)} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Project"><FiEdit2 className="w-4 h-4" /></button>
    <button onClick={() => onConfirm(row)} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Project"><FiTrash2 className="w-4 h-4" /></button>
  </div>
);

export const MasterProjectComponent = (props: MasterProjectProps): React.ReactElement => {
  const { isModalOpen, isConfirmModalOpen, editingProject, deletingProject, openCreateModal, closeModal, closeConfirmModal, onConfirmDelete, onSubmit, pageSize, totalCount, changePageSize, paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage } = props;
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Project Management</span>
          <button onClick={openCreateModal} className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer">Create Project</button>
        </div>
        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          <ProjectToolbar pageSize={pageSize} totalCount={totalCount} changePageSize={changePageSize} />
          <div className="flex-1 overflow-auto">
            <Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} />
          </div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
        </div>
      </div>
      <ProjectFormModal isOpen={isModalOpen} onClose={closeModal} editingProject={editingProject} onSubmit={onSubmit} />
      <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={onConfirmDelete} title="Delete Project" message={`Are you sure you want to delete project "${deletingProject?.name}"?`} confirmText="Delete" cancelText="Cancel" isDestructive />
    </Layout>
  );
};
