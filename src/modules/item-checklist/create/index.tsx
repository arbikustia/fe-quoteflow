import type { ReactElement } from "react";

import { ItemChecklistCreateForm } from "./ItemChecklistCreate.component";
import { useItemChecklistCreate } from "./ItemChecklistCreate.hook";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render Item Checklist create or edit page.
 * @returns {ReactElement} Item Checklist page
 */
const ItemChecklistCreate = (): ReactElement => {
  const form = useItemChecklistCreate();
  const title = form.isEditMode ? "Edit Item Checklist" : "New Item Checklist";
  const subtitle = form.isEditMode ? "Update the item checklist details below." : "Fill in the item checklist details below.";

  return (
    <Layout pageTitle={title}>
      <PageLayout
        title={title}
        subtitle={subtitle}
        breadcrumbs={["Item Checklist", "Item Checklist List", title]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={form.goBack}
      >
        <ItemChecklistCreateForm {...form} />
      </PageLayout>
    </Layout>
  );
};

export default ItemChecklistCreate;
