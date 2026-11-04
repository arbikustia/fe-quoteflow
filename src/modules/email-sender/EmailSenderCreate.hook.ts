import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCreateEmailSenderMutation, useUpdateEmailSenderMutation } from "@/services/email-sender.service";

import type { EmailSender, EmailSenderFormState } from "./EmailSender.type";
import type { EmailSenderCreateProps, EmailSenderFieldErrors } from "./EmailSenderCreate.type";

const initial: EmailSenderFormState = { name: "", email: "", smtp_host: "", smtp_port: 587, smtp_username: "", smtp_password: "", enable_ssl: true, is_default: false, status: 1 };
const toForm = (sender: EmailSender): EmailSenderFormState => ({ ...sender, smtp_password: "" });

const _validateForm = (form: EmailSenderFormState, isEditMode: boolean): EmailSenderFieldErrors => ({
  ...(!form.name.trim() && { name: "Name is required." }),
  ...(!form.email.trim() && { email: "Email is required." }),
  ...(!form.smtp_host.trim() && { smtp_host: "SMTP Host is required." }),
  ...(!form.smtp_port && { smtp_port: "SMTP Port is required." }),
  ...(!form.smtp_username.trim() && { smtp_username: "SMTP Username is required." }),
  ...(!isEditMode && !form.smtp_password.trim() && { smtp_password: "SMTP Password is required." }),
});

export const useEmailSenderCreate = (): EmailSenderCreateProps => {
  const navigate = useNavigate(); const { id } = useParams<{ id?: string }>(); const routeSender = useLocation().state?.emailSender as EmailSender | undefined;
  const [form, setForm] = useState<EmailSenderFormState>(routeSender ? toForm(routeSender) : initial); const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EmailSenderFieldErrors>({});
  const [create, createState] = useCreateEmailSenderMutation(); const [update, updateState] = useUpdateEmailSenderMutation();
  const onChange = (key: keyof EmailSenderFormState) => (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [key]: event.target.value });
    setFieldErrors({ ...fieldErrors, [key]: undefined });
  };
  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setErrorMessage(null);
    const validationErrors = _validateForm(form, Boolean(id));

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    void (async (): Promise<void> => {
      try {
        if (id) {
          await update({ ...form, id }).unwrap();
        } else {
          await create({ ...form, status: 1 }).unwrap();
        }
        const successMessage = id ? "Email sender updated successfully." : "Email sender created successfully.";

        navigate("/master-email-sender", { state: { successMessage } });
      } catch {
        setErrorMessage(id ? "Unable to update email sender." : "Unable to create email sender.");
      }
    })();
  };
  return {
    ...form,
    isEditMode: Boolean(id),
    isSubmitting: createState.isLoading || updateState.isLoading,
    errorMessage,
    fieldErrors,
    onChange,
    onPortChange: (smtp_port): void => {
      setForm({ ...form, smtp_port: smtp_port ?? 0 });
      setFieldErrors({ ...fieldErrors, smtp_port: undefined });
    },
    onSslChange: (enable_ssl): void => setForm({ ...form, enable_ssl }),
    onDefaultChange: (is_default): void => setForm({ ...form, is_default }),
    onStatusChange: (isActive): void => setForm({ ...form, status: isActive ? 1 : 0 }),
    onSubmit,
    onBack: (): void => { navigate("/master-email-sender"); },
  };
};
