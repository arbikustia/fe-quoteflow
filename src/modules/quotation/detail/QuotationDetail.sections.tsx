import type { ReactElement } from "react";

import type {
  CustomerSummary,
  ItemRow,
  PicSummary,
  ProjectSection,
  QuotationInfoSection,
  QuotationTxSummary,
  VoucherSummary,
} from "./QuotationDetail.helpers";

export const renderHeaderCard = (info: QuotationInfoSection): ReactElement => (
  <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Quotation</span>
    <h2 className="my-1 text-xl font-bold text-text-primary">{info.quotationNo}</h2>
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${
        info.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {info.statusText}
    </span>
  </div>
);

export const renderInfoCard = (info: QuotationInfoSection): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="border-b border-border-default px-5 py-3 font-semibold text-text-primary">Quotation Info</div>
    <dl className="grid grid-cols-1 divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="px-5 py-3">
        <dt className="text-xs text-text-secondary">Quotation Date</dt>
        <dd className="text-sm font-medium text-text-primary">{info.quotationDate}</dd>
      </div>
      <div className="px-5 py-3">
        <dt className="text-xs text-text-secondary">Expired At</dt>
        <dd className="text-sm font-medium text-text-primary">{info.expiredAt}</dd>
      </div>
    </dl>
    <div className="border-t border-border-default px-5 py-3">
      <dt className="text-xs text-text-secondary">Notes</dt>
      <dd className="text-sm font-medium text-text-primary">{info.notes}</dd>
    </div>
  </div>
);

export const renderTransactionSummary = (tx: QuotationTxSummary): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="border-b border-border-default px-5 py-3 font-semibold text-text-primary">
      Transaction & Event Summary
    </div>
    <dl className="grid grid-cols-1 gap-y-3 px-5 py-4 sm:grid-cols-2 sm:gap-x-6">
      <div>
        <dt className="text-xs text-text-secondary">Event Name</dt>
        <dd className="text-sm font-medium text-text-primary">{tx.eventName}</dd>
      </div>
      <div>
        <dt className="text-xs text-text-secondary">Service Type</dt>
        <dd className="text-sm font-medium text-text-primary">{tx.serviceTypeName}</dd>
      </div>
      <div>
        <dt className="text-xs text-text-secondary">Start Date</dt>
        <dd className="text-sm font-medium text-text-primary">{tx.startAt}</dd>
      </div>
      <div>
        <dt className="text-xs text-text-secondary">End Date</dt>
        <dd className="text-sm font-medium text-text-primary">{tx.endAt}</dd>
      </div>
      <div className="border-t border-border-default pt-2 sm:col-span-2">
        <div className="flex justify-between py-1 text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-medium text-text-primary">{tx.subtotal}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-text-secondary">Service Fee</span>
          <span className="font-medium text-text-primary">{tx.serviceFee}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-text-secondary">Discount</span>
          <span className="font-medium text-text-primary">{tx.discount}</span>
        </div>
        <div className="flex justify-between border-t border-border-default pt-2 text-base font-bold">
          <span className="text-text-primary">Grand Total</span>
          <span className="text-text-primary">{tx.grandTotal}</span>
        </div>
      </div>
    </dl>
  </div>
);

export const renderEntitiesCard = (
  customer: CustomerSummary,
  pic: PicSummary,
  voucher: VoucherSummary,
): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="border-b border-border-default px-5 py-3 font-semibold text-text-primary">Related Entities</div>
    <dl className="divide-y divide-border-default">
      <div className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-3">
        <dt className="text-xs font-semibold text-text-secondary">Customer</dt>
        <dd className="text-sm text-text-primary sm:col-span-2">
          <div className="font-medium">{customer.name}</div>
          <div className="text-xs text-text-secondary">{customer.phone} - {customer.address}</div>
        </dd>
      </div>
      <div className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-3">
        <dt className="text-xs font-semibold text-text-secondary">PIC</dt>
        <dd className="text-sm text-text-primary sm:col-span-2">
          <div className="font-medium">{pic.name}</div>
        </dd>
      </div>
      <div className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-3">
        <dt className="text-xs font-semibold text-text-secondary">Voucher</dt>
        <dd className="text-sm text-text-primary sm:col-span-2">
          <div className="font-medium">{voucher.name} ({voucher.code})</div>
          <div className="text-xs text-text-secondary">Discount: {voucher.discountPercent}</div>
        </dd>
      </div>
    </dl>
  </div>
);

export const renderRentalItemsCard = (items: ItemRow[]): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="border-b border-border-default px-5 py-3 font-semibold text-text-primary">Rental Items</div>
    <div className="divide-y divide-border-default">
      {items.length === 0 && <p className="px-5 py-4 text-sm text-text-secondary">No items in quotation.</p>}
      {items.map((item) => (
        <div key={item.id} className="flex flex-col justify-between gap-1 px-5 py-3 text-sm sm:flex-row sm:items-center">
          <div>
            <div className="font-medium text-text-primary">{item.name}</div>
            <div className="text-xs text-text-secondary">{item.remark}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-secondary">{item.qty} x {item.price} = </span>
            <span className="font-semibold text-text-primary">{item.subtotal}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const renderProjectsCard = (projects: ProjectSection[]): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
    <div className="border-b border-border-default px-5 py-3 font-semibold text-text-primary">
      Rental Transaction Projects
    </div>
    <div className="divide-y divide-border-default">
      {projects.length === 0 && <p className="px-5 py-4 text-sm text-text-secondary">No project packages.</p>}
      {projects.map((project) => (
        <div key={project.id} className="p-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-text-primary">{project.name}</h4>
            <span className="font-bold text-text-primary">{project.subtotal}</span>
          </div>
          <p className="mb-2 text-xs text-text-secondary">{project.remark}</p>
          <div className="rounded-lg bg-background-surface-subtle p-3">
            <div className="mb-1 text-xs font-semibold text-text-secondary">Project Items</div>
            <div className="divide-y divide-border-default">
              {project.items.map((pi) => (
                <div key={pi.id} className="flex justify-between py-1 text-xs">
                  <span className="text-text-primary">{pi.name}</span>
                  <span className="text-text-secondary">{pi.qty} x {pi.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
