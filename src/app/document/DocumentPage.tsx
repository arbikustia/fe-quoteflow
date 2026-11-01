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
  const navigateToDocument = (): void => { void navigate("/document"); };

  return (
    <Layout pageTitle={title}>
      <PageLayout title={title} breadcrumbs={["Document", title]} onBack={navigateToDocument}>
        <section className="rounded-2xl border border-border-default bg-background-surface p-6">
          <p className="text-sm text-text-secondary">{title} page is not available yet.</p>
        </section>
      </PageLayout>
    </Layout>
  );
};
