import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { DOCUMENT_ITEMS } from "@/components/Sidebar/Sidebar.config";
import type { MasterNavigationItem } from "@/components/Sidebar/Sidebar.type";

import invoiceIllustration from "@/assets/invoice-illustration.webp";
import itemChecklistIllustration from "@/assets/item-checklist-illustration.webp";
import paymentIllustration from "@/assets/payment-illustration.webp";
import quotationIllustration from "@/assets/quotation-illustration.webp";

import Layout from "@/app/layout";
import MobileLayout from "@/app/shared/MobileLayout";

/**
 * Get document illustration by route.
 * @param {string} path - Document route
 * @returns {string} Illustration source
 */
const _getDocumentIllustration = (path: string): string => {
  switch (path) {
    case "/document/quotation":
      return quotationIllustration;
    case "/document/invoice":
      return invoiceIllustration;
    case "/document/item-checklist":
      return itemChecklistIllustration;
    default:
      return paymentIllustration;
  }
};

/**
 * Render document navigation card.
 * @param {NavigationChild} item - Document navigation item
 * @param {(path: string) => void} onNavigate - Document navigation callback
 * @returns {ReactElement} Document navigation card
 */
const _renderDocumentCard = (item: MasterNavigationItem, onNavigate: (path: string) => void): ReactElement => {
  const handleClick = (): void => onNavigate(item.path);
  const illustration = _getDocumentIllustration(item.path);

  return (
    <button
      key={item.path}
      type="button"
      onClick={handleClick}
      className="group flex min-h-36 w-full items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
    >
      <img src={illustration} alt="" aria-hidden="true" className="h-28 w-44 shrink-0 rounded-xl object-contain" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-2xl font-semibold text-text-primary lg:text-lg">{item.name}</span>
        <span className="mt-2 block text-lg leading-7 text-text-secondary lg:text-sm lg:leading-5">{item.description}</span>
      </span>
    </button>
  );
};

/**
 * Render responsive document landing page.
 * @returns {ReactElement} Document landing page
 */
const DocumentMain = (): ReactElement => {
  const navigate = useNavigate();
  const navigateToDocument = (path: string): void => { void navigate(path); };
  const navigateBack = (): void => { void navigate(-1); };
  const content = (
    <div className="flex flex-col gap-6 px-6 pb-20 pt-4 lg:px-0 lg:pt-0">
      <div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={navigateBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-4xl font-bold text-text-primary lg:text-3xl">Document</h1>
        </div>
        <p className="mt-2 text-sm text-text-secondary">Manage quotations, invoices, checklists, and payments.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {DOCUMENT_ITEMS.map((item) => _renderDocumentCard(item, navigateToDocument))}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <Layout pageTitle="Document">{content}</Layout>
      </div>
      <div className="md:hidden">
        <MobileLayout>{content}</MobileLayout>
      </div>
    </>
  );
};

export default DocumentMain;
