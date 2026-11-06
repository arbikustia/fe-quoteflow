import test from "@/libs/unit-test";

import { MailCreateForm } from "./MailCreate.component";
import type { MailComposeFormState } from "./MailCreate.type";

const props: MailComposeFormState = {
  senderId: "sales@example.com",
  template: "quotation",
  to: "customer@example.com",
  subject: "Quotation follow up",
  body: "Hello",
  attachmentName: "quotation.pdf",
  attachmentUrl: "blob:quotation-preview",
  senderOptions: [{ label: "sales@example.com", value: "sales@example.com" }],
  templateOptions: [
    { label: "Quotation", value: "quotation" },
    { label: "Invoice", value: "invoice" },
  ],
  isSenderLoading: false,
  isSubmitting: false,
  handleSenderChange: jest.fn(),
  handleTemplateChange: jest.fn(),
  handleToChange: jest.fn(),
  handleSubjectChange: jest.fn(),
  handleBodyChange: jest.fn(),
  handleAttachmentChange: jest.fn(),
  handleAttachmentRemove: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

const configs = [
  { props, desc: "should render mail compose form" },
  { props: { ...props, isSubmitting: true }, desc: "should render mail compose form while sending" },
  { props: { ...props, isSenderLoading: true, senderOptions: [] }, desc: "should render mail compose form while loading senders" },
];

test.assertSnapshots(MailCreateForm, configs);
