import type { ReactElement } from "react";

import { ItemReturnCreateForm } from "./ItemReturnCreate.component";
import { useItemReturnCreate } from "./ItemReturnCreate.hook";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render Item Return create or edit page.
 * @returns {ReactElement} Item Return page
 */
const ItemReturnCreate = (): ReactElement => {
  const form = useItemReturnCreate();
  const title = form.isEditMode ? "Edit Item Return" : "New Item Return";
  const subtitle = form.isEditMode ? "Update the item return details below." : "Fill in the item return details below.";

  return (
    <Layout pageTitle={title}>
      <PageLayout
        title={title}
        subtitle={subtitle}
        breadcrumbs={["Item Return", "Item Return List", title]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={form.goBack}
      >
        <ItemReturnCreateForm {...form} />
      </PageLayout>
    </Layout>
  );
};

export default ItemReturnCreate;
