import LogoMark from "@/assets/logo.png";

import type { ApiInvoice } from "@/modules/invoice/Invoice.type";
import { MAIL_CONFIG } from "@/modules/mail/Mail.config";
import type { MailTemplate, MailTemplateContent } from "@/modules/mail/Mail.type";
import { formatCurrency } from "@/modules/quotation/detail/QuotationDetail.util";
import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

const PAGE = "#F1F2F4";
const CARD = "#FFFFFF";
const HEADER = "#6B7280";
const TEXT = "#424242";
const FOOTER_BG = "#F7F8FA";
const FOOTER_TEXT = "#9CA3AF";
const FONT = "Arial,Helvetica,sans-serif";
const CONTENT_WIDTH = 600;
const MARK_SIZE = 48;

/**
 * Resolve a bundled asset to an absolute URL that mail clients can load.
 * @param {string} assetPath - Asset URL from the bundler
 * @returns {string} Absolute URL
 */
const _absoluteAssetUrl = (assetPath: string): string =>
  new URL(assetPath, typeof window === "undefined" ? "https://localhost" : window.location.origin).href;

/**
 * Escape HTML special characters.
 * @param {string} value - Raw text
 * @returns {string} Escaped text
 */
export const escapeMailHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Strip tags and attributes that must not be delivered in a mail body.
 * @param {string} html - Rich text body
 * @returns {string} Sanitised html
 */
const _sanitizeBody = (html: string): string =>
  html
    .replace(/<\s*(script|iframe|object|embed|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");

/**
 * Render the composed rich text body.
 * @param {string} html - Sanitised rich text body
 * @returns {string} Body markup
 */
const _renderBodyHtml = (html: string): string =>
  `<div style="margin:0 0 16px;font-family:${FONT};font-size:14px;line-height:1.75;color:${TEXT};">${html}</div>`;

/**
 * Render the coloured header band with the document title and type.
 * @param {MailTemplateContent} content - Template copy
 * @returns {string} Header markup
 */
const _renderHeader = (content: MailTemplateContent): string =>
  [
    `<tr><td style="background-color:${HEADER};padding:26px 32px;border-radius:12px 12px 0 0;">`,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>',
    `<td width="${MARK_SIZE + 12}" valign="middle"><img src="${_absoluteAssetUrl(LogoMark)}" width="${MARK_SIZE}" height="${MARK_SIZE}" alt="${MAIL_CONFIG.BRAND_NAME}" style="display:block;width:${MARK_SIZE}px;height:${MARK_SIZE}px;border:0;" /></td>`,
    "<td valign=\"middle\">",
    `<h1 style="margin:0;font-family:${FONT};font-size:22px;font-weight:700;line-height:1.3;color:#FFFFFF;">${content.title}</h1>`,
    `<p style="margin:6px 0 0;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.78);">${content.subtitle}</p>`,
    "</td></tr></table>",
    "</td></tr>",
  ].join("");

/**
 * Format an ISO date as a short Indonesian date.
 * @param {string} [value] - ISO date
 * @returns {string} Formatted date or an empty string
 */
const _shortDate = (value?: string): string => (value ? new Date(value).toLocaleDateString("id-ID") : "");

/**
 * Render a two-column summary table, skipping empty rows.
 * @param {[string, string][]} rows - Label/value pairs
 * @returns {string} Summary markup
 */
const _renderSummaryRows = (rows: [string, string][]): string => {
  const visibleRows = rows.filter(([, value]) => Boolean(value));

  if (!visibleRows.length) return "";

  return [
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border-top:1px solid #E5E7EB;font-family:${FONT};font-size:13px;color:${TEXT};">`,
    ...visibleRows.map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;width:44%;color:${FOOTER_TEXT};">${label}</td><td style="padding:8px 0;font-weight:600;">${escapeMailHtml(value)}</td></tr>`,
    ),
    "</table>",
  ].join("");
};

/**
 * Render the selected quotation transaction summary below the body.
 * @param {ApiQuotation} quotation - Selected quotation
 * @returns {string} Summary markup
 */
const _renderQuotationSummary = (quotation: ApiQuotation): string => {
  const transaction = quotation.transaction;

  return _renderSummaryRows([
    ["Quotation No", quotation.quotation_no],
    ["Quotation Date", _shortDate(quotation.quotation_date)],
    ["Customer", transaction?.customer_name ?? ""],
    ["Event", transaction?.event_name ?? ""],
    ["Period", [_shortDate(transaction?.start_at), _shortDate(transaction?.end_at)].filter(Boolean).join(" - ")],
    ["Grand Total", formatCurrency(transaction?.grand_total)],
  ]);
};

/**
 * Render the selected invoice transaction summary below the body.
 * @param {ApiInvoice} invoice - Selected invoice
 * @returns {string} Summary markup
 */
const _renderInvoiceSummary = (invoice: ApiInvoice): string => {
  const transaction = invoice.quotation?.transaction;

  return _renderSummaryRows([
    ["Invoice No", invoice.invoice_no],
    ["Invoice Date", _shortDate(invoice.invoice_date)],
    ["Due Date", _shortDate(invoice.due_date)],
    ["Customer", transaction?.customer_name ?? ""],
    ["Event", transaction?.event_name ?? ""],
    ["Grand Total", formatCurrency(transaction?.grand_total)],
  ]);
};

/**
 * Render the white content area with the composed body and document summary.
 * @param {string} body - Escaped compose body
 * @param {{ quotation?: ApiQuotation; invoice?: ApiInvoice }} document - Selected document
 * @returns {string} Content markup
 */
const _renderBody = (body: string, document: { quotation?: ApiQuotation; invoice?: ApiInvoice }): string => {
  let summary = "";

  if (document.invoice) {
    summary = _renderInvoiceSummary(document.invoice);
  } else if (document.quotation) {
    summary = _renderQuotationSummary(document.quotation);
  }

  return [`<tr><td style="background-color:${CARD};padding:28px 32px 24px;">`, _renderBodyHtml(body), summary, "</td></tr>"].join("");
};

/**
 * Render the muted footer strip.
 * @param {MailTemplateContent} content - Template copy
 * @returns {string} Footer markup
 */
const _renderFooter = (content: MailTemplateContent): string =>
  [
    `<tr><td align="center" style="background-color:${FOOTER_BG};padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #E5E7EB;">`,
    `<p style="margin:0 0 4px;font-family:${FONT};font-size:12px;line-height:1.6;color:${FOOTER_TEXT};">${content.footerNote}</p>`,
    `<p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:${FOOTER_TEXT};">${content.footerSign}</p>`,
    "</td></tr>",
  ].join("");

/**
 * Build the HTML mail body for the selected template.
 * @param {string} body - Plain text mail body entered by the user
 * @param {MailTemplate} template - Selected mail template
 * @param {ApiQuotation} [quotation] - Quotation shown in the summary
 * @param {ApiInvoice} [invoice] - Invoice shown in the summary
 * @returns {string} HTML mail body
 */
export const buildMailHtmlTemplate = (
  body: string,
  template: MailTemplate = MAIL_CONFIG.DEFAULT_TEMPLATE,
  quotation?: ApiQuotation,
  invoice?: ApiInvoice,
): string => {
  const content = MAIL_CONFIG.TEMPLATE_CONTENT[template];
  const paragraphs = _sanitizeBody(body.trim());

  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />',
    "</head>",
    `<body style="margin:0;padding:0;background-color:${PAGE};">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAGE};padding:24px 12px;">`,
    '<tr><td align="center">',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${CONTENT_WIDTH}px;background-color:${CARD};border-radius:12px;box-shadow:0 1px 3px rgba(16,24,40,0.10);font-family:${FONT};">`,
    _renderHeader(content),
    _renderBody(paragraphs, { quotation, invoice }),
    _renderFooter(content),
    "</table>",
    "</td></tr>",
    "</table>",
    "</body></html>",
  ].join("");
};
