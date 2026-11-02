import type { ReactElement } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { ItemChecklistCreateForm } from "./ItemChecklistCreate.component";
import { useItemChecklistCreate } from "./ItemChecklistCreate.hook";

const ItemChecklistCreate = (): ReactElement => {
  const form = useItemChecklistCreate();
  const title = form.isEditMode ? "Edit Checklist" : "New Checklist";

  return (
    <Layout pageTitle={title} mobileWhiteBackground={true}>
      <PageLayout
        title={title}
        subtitle={form.isEditMode ? "Update rental item checklist." : "Create rental item checklist."}
        breadcrumbs={["Item Checklist", title]}
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
