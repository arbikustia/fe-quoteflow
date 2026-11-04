import { type ReactElement, useState } from "react";

import { AlertComponent } from "@/components/Alert";
import { SwitchComponent } from "@/components/Switch";

import type { ReportOrderStatusFormProps } from "../Report.type";

/**
 * Render report order status form.
 * @param {ReportOrderStatusFormProps} props - Status form props
 * @returns {ReactElement} Status form
 */
export const ReportOrderStatusForm = (props: ReportOrderStatusFormProps): ReactElement => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleConfirm = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-background-surface p-6 shadow-overlay">
            <h3 className="text-xl font-semibold">Konfirmasi Penyelesaian</h3>
            <p className="mt-2 text-lg text-text-secondary">Apakah Anda yakin ingin menyelesaikan order ini?</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-3xl border border-border-default px-4 py-3 text-lg font-semibold text-text-secondary">Batal</button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  props.handleSubmit();
                }}
                className="flex-1 rounded-3xl bg-action-primary px-4 py-3 text-lg font-semibold text-text-inverse"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
      <form noValidate onSubmit={handleConfirm} className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-5 lg:rounded-3xl lg:p-10">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-medium text-text-secondary">Order No</p>
            <p className="mt-1 text-xl font-semibold text-text-primary">{props.orderNo ?? "Unavailable"}</p>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-border-default bg-background-surface px-5 py-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">Status Penyelesaian</span>
              <span className="text-lg text-text-secondary">Pilih status untuk menyelesaikan order ini</span>
            </div>
            <SwitchComponent
              label="Order status"
              checked={props.isActive}
              disabled={props.isSubmitting || !props.orderNo}
              onChange={props.handleStatusChange}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-row gap-3 pt-5 border-t border-border-default">
          <button
            type="button"
            onClick={props.goBack}
            className="h-14 flex-1 cursor-pointer rounded-3xl border border-border-default bg-transparent px-4 text-lg font-semibold tracking-wide text-text-secondary transition-colors hover:bg-background-subtle"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={props.isSubmitting || !props.orderNo}
            className="h-14 flex-1 cursor-pointer rounded-3xl bg-action-primary px-4 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {props.isSubmitting ? "Menyelesaikan…" : "Selesaikan Order Ini"}
          </button>
        </div>
      </form>
    </div>
  );
};
