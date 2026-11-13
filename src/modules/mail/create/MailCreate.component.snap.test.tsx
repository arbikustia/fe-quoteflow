import { MOCK_MAIL_FORM_PROPS } from "@/fixture/mail";
import test from "@/libs/unit-test";

import { MailCreateForm } from "./MailCreate.component";

jest.mock("@/components/RichTextEditor", () => ({
  RichTextEditor: (): React.ReactElement => <div>Editor</div>,
}));

describe("MailCreateForm snapshot", () => {
  test.assertSnapshots(MailCreateForm, [
    { props: MOCK_MAIL_FORM_PROPS, desc: "should render mail compose form" },
    { props: { ...MOCK_MAIL_FORM_PROPS, isSubmitting: true }, desc: "should render mail compose form while sending" },
    { props: { ...MOCK_MAIL_FORM_PROPS, isSenderLoading: true, senderOptions: [] }, desc: "should render mail compose form while loading senders" },
    { props: { ...MOCK_MAIL_FORM_PROPS, template: "invoice" as const }, desc: "should render mail compose form with the invoice template" },
  ]);
});
