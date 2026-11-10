import { useState } from "react";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";
import { usePagePermission } from "@/hooks/usePagePermission";

import ConfirmModal from "@/components/ConfirmModal";

import { useUpdateRentalOrderMutation } from "@/services/rental-order.service";

import { ReportOrderComponent } from "./Report.component";
import { useReportOrderExport, useReportOrderNavigation, useReportOrderPagination } from "./Report.hook";
import type { ReportOrderData } from "./Report.type";

/**
 * Report Order Container.
 * @returns {React.ReactElement | null} Container element
 */
const ReportOrderContainer = (): React.ReactElement | null => {
  const { goBack } = useReportOrderNavigation();
  const pagination = useReportOrderPagination();
  const { isExporting, onExport } = useReportOrderExport();
  const { canView } = usePagePermission("/report");
  
  const [isConfirmOpen, setIsConfirmOpen] = useState<ReportOrderData | null>(null);
  const [updateRentalOrder, { isLoading: isSubmitting }] = useUpdateRentalOrderMutation();
  const { logEdit } = useMasterActivityLog("Report Order");

  if (!canView) return null;

  const onConfirm = async (): Promise<void> => {
    if (!isConfirmOpen) return;
    try {
      await updateRentalOrder({
        id: isConfirmOpen.id,
        transaction_id: isConfirmOpen.transactionId,
        invoice_id: isConfirmOpen.invoiceId,
        quotation_id: isConfirmOpen.quotationId,
        order_no: isConfirmOpen.orderNo,
        order_date: isConfirmOpen.rawOrderDate,
        notes: isConfirmOpen.notes,
        status: 2,
      }).unwrap();
      await logEdit(isConfirmOpen.orderNo);
      setIsConfirmOpen(null);
    } catch {
      // handle error
    }
  };

  return (
    <>
      <ReportOrderComponent
        {...pagination}
        isSubmitting={isSubmitting}
        confirmOrder={isConfirmOpen}
        onBack={goBack}
        onEditStatus={setIsConfirmOpen}
        onConfirm={onConfirm}
        onCancelConfirm={() => setIsConfirmOpen(null)}
        onExport={onExport}
        isExporting={isExporting}
      />
      <ConfirmModal
        isOpen={Boolean(isConfirmOpen)}
        onClose={() => setIsConfirmOpen(null)}
        onConfirm={() => void onConfirm()}
        title="Confirm Completion"
        message={`Are you sure you want to mark order ${isConfirmOpen?.orderNo ?? ""} as done?`}
        confirmText={isSubmitting ? "Saving…" : "Save"}
        cancelText="Cancel"
      />
    </>
  );
};

export default ReportOrderContainer;
