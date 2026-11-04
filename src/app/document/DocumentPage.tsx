import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { DocumentPageProps } from "./DocumentPage.type";

/**
 * Render document placeholder page.
 * @param {DocumentPageProps} props - Document page props
 * @returns {ReactElement} Document page
 */
export const DocumentPage = ({ title }: DocumentPageProps): ReactElement => {
  const navigate = useNavigate();
  const navigateBack = (): void => { void navigate("/document"); };
  const breadcrumbs = ["Document", title];

  return (
    <Layout pageTitle={title}>
      <PageLayout title={title} subtitle={`Manage ${title.toLowerCase()} workflow and status.`} breadcrumbs={breadcrumbs} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={navigateBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:min-h-[420px] md:flex-1 md:flex-col lg:flex">
            <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
              <div className="h-12 w-72 animate-pulse rounded-3xl bg-background-subtle" />
              <div className="h-14 w-44 animate-pulse rounded-3xl bg-background-subtle" />
            </div>
            <div className="flex flex-1 items-center justify-center text-lg text-text-secondary">{title} data is not available yet.</div>
          </div>
          <div className="flex min-h-[420px] flex-col gap-4 pt-2 pb-16 lg:hidden">
            <div className="h-16 w-full animate-pulse rounded-full bg-background-subtle" />
            <div className="flex flex-1 items-center justify-center rounded-3xl border border-border-strong bg-background-surface p-6 text-center text-lg text-text-secondary">{title} data is not available yet.</div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
