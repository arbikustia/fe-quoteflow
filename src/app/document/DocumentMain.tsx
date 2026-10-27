import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { DOCUMENT_ITEMS } from "@/components/Sidebar/Sidebar.config";
import type { NavigationChild } from "@/components/Sidebar/Sidebar.type";

import Layout from "@/app/layout";
import MobileLayout from "@/app/shared/MobileLayout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render document navigation card.
 * @param {NavigationChild} item - Document navigation item
 * @param {(path: string) => void} onNavigate - Document navigation callback
 * @returns {ReactElement} Document navigation card
 */
const _renderDocumentCard = (item: NavigationChild, onNavigate: (path: string) => void): ReactElement => {
  const handleClick = (): void => onNavigate(item.path);

  return (
    <button
      key={item.path}
      type="button"
      onClick={handleClick}
      className="group flex min-h-36 w-full items-center justify-between rounded-2xl border border-border-default bg-background-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"
    >
      <span className="text-2xl font-semibold text-text-primary lg:text-lg">{item.name}</span>
      <span aria-hidden="true" className="text-3xl text-text-tertiary transition-transform group-hover:translate-x-1 lg:text-xl">→</span>
    </button>
  );
};

/**
 * Render responsive document landing page.
 * @returns {ReactElement} Document landing page
 */
const DocumentMain = (): ReactElement => {
  const navigate = useNavigate();
  const navigateBack = (): void => { void navigate(-1); };
  const navigateToDocument = (path: string): void => { void navigate(path); };
  const content = (
    <div className="flex flex-col gap-6 px-0 pb-20 lg:px-0">
      <div>
        <h1 className="text-4xl font-bold text-text-primary lg:text-3xl">Document</h1>
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
        <Layout pageTitle="Document">
          <PageLayout title="Document" breadcrumbs={["Document"]} onBack={navigateBack}>
            {content}
          </PageLayout>
        </Layout>
      </div>
      <div className="md:hidden">
        <MobileLayout>
          <PageLayout title="Document" breadcrumbs={["Document"]} mobileHeaderClassName="px-0" onBack={navigateBack}>
            {content}
          </PageLayout>
        </MobileLayout>
      </div>
    </>
  );
};

export default DocumentMain;
