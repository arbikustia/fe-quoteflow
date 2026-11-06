import { describe, expect, it } from "@jest/globals";

import { buildMailHtmlTemplate, buildMailSendFormData } from "@/services/mail/mail.service";

describe("buildMailHtmlTemplate", () => {
  it("should render the template with the default quotation copy", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Hello team");
    expect(html).toContain("Congrats, your quotation has been");
    expect(html).toContain(">Ready<");
  });

  it("should switch the hero copy to invoice", () => {
    const html = buildMailHtmlTemplate("Hello team", "invoice");

    expect(html).toContain("Congrats, your invoice has been");
    expect(html).toContain(">Confirmed<");
    expect(html).not.toContain("Congrats, your quotation has been");
  });

  it("should fall back to the template note when the body is empty", () => {
    expect(buildMailHtmlTemplate("")).toContain("We&#39;ve put together a quotation");
  });

  it("should convert newlines to line breaks", () => {
    expect(buildMailHtmlTemplate("line one\nline two")).toContain("line one<br />line two");
  });

  it("should escape html in the body", () => {
    const html = buildMailHtmlTemplate("<script>alert('x')</script>");

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("should render the logo mark and colour-scheme overrides", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("logo.png");
    expect(html).toContain('name="color-scheme" content="light dark"');
    expect(html).toContain("@media (prefers-color-scheme:dark)");
  });

  it("should default to a light gray page and keep dark only as an override", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("background-color:#F7F8FA");
    expect(html).not.toContain("background-color:#C8D0D8");
    expect(html).not.toContain("background-color:#16202E;");
  });
});

describe("buildMailSendFormData", () => {
  it("should append required multipart fields with the html body", () => {
    const formData = buildMailSendFormData("sales@example.com", "customer@example.com", "Follow up", "Hello");

    expect(formData.get("senderId")).toBe("sales@example.com");
    expect(formData.get("to")).toBe("customer@example.com");
    expect(formData.get("subject")).toBe("Follow up");
    expect(formData.get("body")).toBe(buildMailHtmlTemplate("Hello"));
    expect(formData.get("isHtml")).toBe("true");
    expect(formData.get("attachments")).toBeNull();
  });

  it("should render the selected template in the body", () => {
    const formData = buildMailSendFormData("sales@example.com", "customer@example.com", "Follow up", "Hello", undefined, "invoice");

    expect(formData.get("body")).toContain(">Confirmed<");
  });

  it("should append the pdf attachment when provided", () => {
    const file = new File(["pdf"], "quotation.pdf", { type: "application/pdf" });
    const formData = buildMailSendFormData("sales@example.com", "customer@example.com", "Follow up", "Hello", file);

    expect(formData.get("attachments")).toBeInstanceOf(File);
    expect((formData.get("attachments") as File).name).toBe("quotation.pdf");
  });
});
