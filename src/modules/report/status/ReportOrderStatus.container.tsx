import type { ReactElement } from "react";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { useReportOrderStatusForm } from "../Report.hook";
import { ReportOrderStatusForm } from "./ReportOrderStatus.component";

/**
 * Render report order status container.
 * @returns {ReactElement} Status page
 */
const ReportOrderStatusContainer = (): ReactElement => {
  const formState = useReportOrderStatusForm();

  return (
    <Layout pageTitle="Update Order Status">
      <PageLayout
        title="Selesaikan Order"
        subtitle="Ubah status untuk menyelesaikan transaksi order ini."
        breadcrumbs={["Report", "Order Report", "Selesaikan Order"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={formState.goBack}
      >
        <ReportOrderStatusForm {...formState} />
      </PageLayout>
    </Layout>
  );
};

export default ReportOrderStatusContainer;
