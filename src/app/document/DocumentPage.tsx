import type { ReactElement } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { DocumentPageProps } from "./DocumentPage.type";

/**
 * Navigate to previous page.
 * @returns {void} No return value
 */
const _navigateBack = (): void => window.history.back();

/**
 * Render document placeholder page.
 * @param {DocumentPageProps} props - Document page props
 * @returns {ReactElement} Document page
 */
export const DocumentPage = ({ title }: DocumentPageProps): ReactElement => (
  <Layout pageTitle={title}>
    <PageLayout title={title} breadcrumbs={["Document", title]} onBack={_navigateBack}>
      <section className="rounded-2xl border border-border-default bg-background-surface p-6">
        <p className="text-sm text-text-secondary">{title} page is not available yet.</p>
      </section>
    </PageLayout>
  </Layout>
);
