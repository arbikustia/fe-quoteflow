import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { DOCUMENT_ITEMS } from "@/components/Sidebar/Sidebar.config";
import type { MasterNavigationItem } from "@/components/Sidebar/Sidebar.type";

import invoiceIllustration from "@/assets/invoice-illustration.webp";
import paymentIllustration from "@/assets/payment-illustration.webp";
import quotationIllustration from "@/assets/quotation-illustration.webp";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { useDocumentIllustrationsLoaded } from "./DocumentMain.hook";

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
 * Render document navigation card skeleton.
 * @param {number} key - Skeleton key
 * @returns {ReactElement} Document card skeleton
 */
const _renderDocumentSkeleton = (key: number): ReactElement => (
  <div key={key} className="flex min-h-36 animate-pulse items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5" role="status" aria-label="Loading document">
    <div data-testid="document-card-skeleton-image" className="h-28 w-44 shrink-0 rounded-xl bg-background-subtle" />
    <div className="min-w-0 flex-1 pt-1">
      <div className="h-6 w-2/3 rounded-md bg-background-subtle" />
      <div className="mt-3 h-4 w-full rounded-md bg-background-subtle" />
      <div className="mt-2 h-4 w-4/5 rounded-md bg-background-subtle" />
    </div>
  </div>
);

/**
 * Render responsive document landing page.
 * @returns {ReactElement} Document landing page
 */
const DocumentMain = (): ReactElement => {
  const navigate = useNavigate();
  const isIllustrationsLoaded = useDocumentIllustrationsLoaded();
  const skeletonKeys = DOCUMENT_ITEMS.map((_item, index) => index);
  const navigateToDocument = (path: string): void => { void navigate(path); };
  const navigateBack = (): void => { void navigate("/home"); };

  return (
    <Layout pageTitle="Document" mobileWhiteBackground={true}>
      <PageLayout title="Document" subtitle="Manage core documents used across QuoteFlow." breadcrumbs={["Document"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={navigateBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex flex-col gap-6 pb-20 pt-2 lg:pt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {isIllustrationsLoaded ? DOCUMENT_ITEMS.map((item) => _renderDocumentCard(item, navigateToDocument)) : skeletonKeys.map(_renderDocumentSkeleton)}
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};

export default DocumentMain;
