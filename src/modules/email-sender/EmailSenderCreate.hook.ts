import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCreateEmailSenderMutation, useUpdateEmailSenderMutation } from "@/services/email-sender.service";

import type { EmailSender, EmailSenderFormState } from "./EmailSender.type";
import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

const initial: EmailSenderFormState = { name: "", email: "", smtp_host: "", smtp_port: 587, smtp_username: "", smtp_password: "", enable_ssl: true, is_default: false, status: 1 };
const toForm = (sender: EmailSender): EmailSenderFormState => ({ ...sender, smtp_password: "" });

export const useEmailSenderCreate = (): EmailSenderCreateProps => {
  const navigate = useNavigate(); const { id } = useParams<{ id?: string }>(); const routeSender = useLocation().state?.emailSender as EmailSender | undefined;
  const [form, setForm] = useState<EmailSenderFormState>(routeSender ? toForm(routeSender) : initial); const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [create, createState] = useCreateEmailSenderMutation(); const [update, updateState] = useUpdateEmailSenderMutation();
  const onChange = (key: keyof EmailSenderFormState) => (event: ChangeEvent<HTMLInputElement>): void => setForm({ ...form, [key]: event.target.value });
  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setErrorMessage(null);
    void (async (): Promise<void> => {
      try {
        if (id) {
          await update({ ...form, id }).unwrap();
        } else {
          await create({ ...form, status: 1 }).unwrap();
        }
        navigate("/master-email-sender");
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
    onChange,
    onPortChange: (smtp_port): void => setForm({ ...form, smtp_port: smtp_port ?? 0 }),
    onSslChange: (enable_ssl): void => setForm({ ...form, enable_ssl }),
    onDefaultChange: (is_default): void => setForm({ ...form, is_default }),
    onSubmit,
    onBack: (): void => { navigate(-1); },
  };
};
