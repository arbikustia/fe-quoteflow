import type { ReactElement } from "react";

import type { CustomerData } from "../MasterCustomer.type";

import type { MasterCustomerDetailState } from "./MasterCustomerDetail.type";

import Layout from "@/app/layout";

/**
 * Render not found state
 * @returns {ReactElement} Not found element
 */
const _renderNotFound = (): ReactElement => (
  <Layout pageTitle="Detail Customer">
    <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-text-secondary font-medium">Customer not found</p>
      </div>
    </div>
  </Layout>
);

/**
 * Render header action bar
 * @param {MasterCustomerDetailState} props - Detail props
 * @returns {ReactElement} Header element
 */
const _renderHeader = (props: MasterCustomerDetailState): ReactElement => {
  const { goBack, toggleMore, closeMore, isMoreOpen, goEdit, openDeleteModal } = props;

  return (
    <div className="flex items-center justify-between py-2 mb-1 lg:mb-4 relative">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="w-11 h-11 rounded-full bg-background-surface hover:bg-background-subtle border border-border-default active:scale-95 transition-all flex items-center justify-center text-text-primary shrink-0"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M12 19 5 12l7-7" />
        </svg>
      </button>
      <h1 className="flex-1 text-center text-[17px] font-semibold text-text-primary tracking-tight px-2 truncate">
        Detail Customer
      </h1>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={toggleMore}
          aria-label="More options"
          aria-expanded={isMoreOpen}
          aria-haspopup="menu"
          className="w-11 h-11 rounded-full bg-background-surface hover:bg-background-subtle border border-border-default active:scale-95 transition-all flex items-center justify-center text-text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </button>
        {isMoreOpen && (
          <>
            <button type="button" aria-label="Close menu" onClick={closeMore} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
            <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-20 w-40 rounded-2xl border border-border-default bg-background-surface py-2 shadow-xl overflow-hidden">
              <button role="menuitem" type="button" onClick={goEdit} className="w-full px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-background-subtle">
                Edit
              </button>
              <button role="menuitem" type="button" onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Render customer primary card
 * @param {CustomerData} customer - Customer data
 * @returns {ReactElement} Card element
 */
const _renderCustomerCard = (customer: CustomerData): ReactElement => {
  const isCustomerActive = customer.status.toLowerCase() === "active";

  return (
    <div className="bg-background-surface rounded-3xl p-5 border border-border-default shadow-xs">
      <div className="flex-1 min-w-0 text-center py-2">
        <h2 className="text-[20px] font-bold text-text-primary leading-tight truncate mb-2">{customer.name}</h2>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${isCustomerActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {customer.status}
        </span>
      </div>
    </div>
  );
};

/**
 * Render customer details definition list
 * @param {CustomerData} customer - Customer data
 * @returns {ReactElement} Card element
 */
const _renderDetailsCard = (customer: CustomerData): ReactElement => (
  <div className="bg-background-surface rounded-3xl border border-border-default shadow-xs overflow-hidden">
    <div className="px-5 pt-5 pb-3">
      <h3 className="text-[12px] font-bold text-text-tertiary tracking-widest uppercase">Customer Details</h3>
    </div>
    <dl className="divide-y divide-border-default">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <dt className="text-[13px] font-medium text-text-secondary shrink-0">Customer ID</dt>
        <dd className="font-semibold text-text-primary text-[15px] text-right truncate">{customer.id}</dd>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <dt className="text-[13px] font-medium text-text-secondary shrink-0">Phone</dt>
        <dd className="font-semibold text-text-primary text-[15px] text-right">{customer.phoneNumber}</dd>
      </div>
      <div className="flex gap-4 px-5 py-4">
        <dt className="text-[13px] font-medium text-text-secondary shrink-0 w-[92px] pt-0.5">Address</dt>
        <dd className="font-semibold text-text-primary text-[15px] text-right flex-1 leading-snug">{customer.address}</dd>
      </div>
    </dl>
  </div>
);

/**
 * Render record audit information
 * @param {CustomerData} customer - Customer data
 * @returns {ReactElement} Record info element
 */
const _renderRecordInfo = (customer: CustomerData): ReactElement => (
  <div className="bg-background-surface rounded-3xl border border-border-default shadow-xs overflow-hidden">
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-[12px] font-bold text-text-tertiary tracking-widest uppercase">Record Info</h3>
    </div>
    <div className="grid grid-cols-2 divide-x divide-border-default">
      <div className="px-5 py-4">
        <p className="text-[13px] font-medium text-text-secondary mb-1">Created By</p>
        <p className="font-semibold text-text-primary text-[15px] truncate">{customer.createBy}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-[13px] font-medium text-text-secondary mb-1">Created At</p>
        <p className="font-semibold text-text-primary text-[15px]">{customer.createAt}</p>
      </div>
    </div>
  </div>
);

/**
 * Render delete confirmation modal
 * @param {MasterCustomerDetailState} props - Detail props
 * @returns {ReactElement | null} Modal element or null
 */
const _renderDeleteModal = (props: MasterCustomerDetailState): ReactElement | null => {
  const { customer, isDeleteModalOpen, closeDeleteModal, handleDelete } = props;

  if (!isDeleteModalOpen || !customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-background-surface rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        </div>
        <h3 className="text-[22px] font-bold text-center text-text-primary mb-2">Delete Customer?</h3>
        <p className="text-[14px] text-text-secondary text-center mb-8 font-medium">Are you sure you want to delete <span className="text-text-primary font-bold">{customer.name}</span>?</p>
        <div className="flex gap-3">
          <button type="button" onClick={closeDeleteModal} className="flex-1 py-3.5 bg-background-subtle text-text-primary font-bold rounded-2xl hover:bg-border-default transition-colors">Cancel</button>
          <button type="button" onClick={handleDelete} className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

/**
 * Master Customer Detail pure UI component.
 * @param {MasterCustomerDetailState} props - Detail component props
 * @returns {ReactElement} Component element
 */
export const MasterCustomerDetailComponent = (props: MasterCustomerDetailState): ReactElement => {
  const { customer } = props;

  if (!customer) {
    return _renderNotFound();
  }

  return (
    <Layout pageTitle="Detail Customer">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
        {_renderHeader(props)}
        <div className="pb-24 space-y-4">
          {_renderCustomerCard(customer)}
          {_renderDetailsCard(customer)}
          {_renderRecordInfo(customer)}
        </div>
        {_renderDeleteModal(props)}
      </div>
    </Layout>
  );
};
