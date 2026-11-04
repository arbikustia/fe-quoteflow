import type { ReactElement } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { ItemReturnCreateForm } from "./ItemReturnCreate.component";
import { useItemReturnCreate } from "./ItemReturnCreate.hook";

const ItemReturnCreate = (): ReactElement => {
  const form = useItemReturnCreate();
  const title = form.isEditMode ? "Edit Return" : "Return Item";

  return (
    <Layout pageTitle={title}>
      <PageLayout
        title={title}
        subtitle={form.isEditMode ? "Update rental item return." : "Create rental item return."}
        breadcrumbs={["Item Return", title]}
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
