/* eslint-disable max-lines-per-function, jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import type { ReactElement } from "react";

import type { PaymentMethodData } from "../MasterPaymentMethod.type";

import type { MasterPaymentMethodDetailState } from "./MasterPaymentMethodDetail.type";

import Layout from "@/app/layout";

/**
 * Render not found state
 * @returns {ReactElement} Not found component
 */
const _renderNotFound = (): ReactElement => (
  <Layout pageTitle="Detail Payment Method">
    <div className="flex h-full items-center justify-center py-20">
      <p className="font-medium text-text-secondary">Payment Method not found</p>
    </div>
  </Layout>
);

/**
 * Render detail header
 * @param {MasterPaymentMethodDetailState} props - Detail props
 * @returns {ReactElement} Header
 */
const _renderHeader = (props: MasterPaymentMethodDetailState): ReactElement => {
  const { goBack, toggleMore, isMoreOpen, closeMore, goEdit, openDeleteModal } = props;

  return (
    <div className="relative mb-4 flex items-center justify-between py-2">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M12 19 5 12l7-7" />
        </svg>
      </button>
      <h1 className="flex-1 truncate px-2 text-center text-lg font-semibold text-text-primary">
        Detail Payment Method
      </h1>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={toggleMore}
          aria-label="More options"
          aria-expanded={isMoreOpen}
          aria-haspopup="menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
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
            <div role="menu" className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-border-default bg-background-surface py-2 shadow-medium">
              <button
                role="menuitem"
                type="button"
                onClick={goEdit}
                className="w-full px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-background-subtle"
              >
                Edit
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={openDeleteModal}
                className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
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
 * Render detail content
 * @param {PaymentMethodData} item - Payment method
 * @returns {ReactElement} Details
 */
const _renderDetails = (item: PaymentMethodData): ReactElement => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
      <h2 className="mb-2 truncate text-xl font-semibold text-text-primary">{item.name}</h2>
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {item.status}
      </span>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5">
        <h3 className="text-sm font-semibold text-text-primary">Payment Method details</h3>
      </div>
      <dl className="divide-y divide-border-default">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-text-secondary">Name</dt>
          <dd className="truncate text-right text-sm font-medium text-text-primary">{item.name}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-text-secondary">Description</dt>
          <dd className="truncate text-right text-sm font-medium text-text-primary">{item.description}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-text-secondary">ID</dt>
          <dd className="truncate text-right text-sm font-medium text-text-primary">{item.id}</dd>
        </div>
      </dl>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5">
        <h3 className="text-sm font-semibold text-text-primary">Record info</h3>
      </div>
      <dl className="grid grid-cols-1 divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4">
          <dt className="mb-1 text-sm text-text-secondary">Created by</dt>
          <dd className="truncate text-sm font-medium text-text-primary">{item.createBy}</dd>
        </div>
        <div className="px-5 py-4">
          <dt className="mb-1 text-sm text-text-secondary">Created at</dt>
          <dd className="truncate text-sm font-medium text-text-primary">{item.createAt}</dd>
        </div>
      </dl>
    </div>
  </div>
);

/**
 * Render delete confirmation dialog
 * @param {MasterPaymentMethodDetailState} props - Detail props
 * @returns {ReactElement | null} Modal
 */
const _renderDeleteModal = (props: MasterPaymentMethodDetailState): ReactElement | null => {
  const { paymentMethod, isDeleteModalOpen, closeDeleteModal, handleDelete } = props;

  if (!isDeleteModalOpen || !paymentMethod) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="delete-pm-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-xl border border-border-default bg-background-surface p-6 shadow-overlay">
        <h3 id="delete-pm-title" className="mb-2 text-center text-xl font-semibold text-text-primary">Delete payment method?</h3>
        <p className="mb-8 text-center text-sm text-text-secondary">
          Delete <span className="font-semibold text-text-primary">{paymentMethod.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle px-4 py-3 text-sm font-medium text-text-primary hover:bg-border-default">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Master Payment Method Detail pure UI component
 * @param {MasterPaymentMethodDetailState} props - State and actions
 * @returns {ReactElement} Component
 */
 
/**
 *
 * @param props
 */
export const MasterPaymentMethodDetailComponent = (props: MasterPaymentMethodDetailState): ReactElement => {
  const { paymentMethod } = props;

  if (!paymentMethod) {
    return _renderNotFound();
  }

  return (
    <Layout pageTitle="Detail Payment Method">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
        {_renderHeader(props)}
        {_renderDetails(paymentMethod)}
        {_renderDeleteModal(props)}
      </div>
    </Layout>
  );
};
