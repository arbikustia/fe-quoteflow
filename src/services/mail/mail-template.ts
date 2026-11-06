import LogoMark from "@/assets/logo.png";

import { MAIL_CONFIG } from "@/modules/mail/Mail.config";
import type { MailTemplate, MailTemplateContent } from "@/modules/mail/Mail.type";

const LIGHT = {
  PAGE: "#F7F8FA",
  HERO_BAND: "#E8EFFB",
  TEXT: "#16202E",
  MUTED: "#4B5563",
  EYEBROW: "#1F6F53",
  ACCENT: "#FC6901",
};

const DARK = {
  PAGE: "#16202E",
  HERO_BAND: "#1D2F4D",
  TEXT: "#FFFFFF",
  MUTED: "#9AA6B2",
  EYEBROW: "#7FE0C0",
  ACCENT: "#FC6901",
};

const FONT = "Arial,Helvetica,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const CONTENT_WIDTH = 600;
const MARK_SIZE = 56;

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
 * Render the dark colour-scheme overrides.
 * Base markup is light, so clients that drop media queries (Gmail web) stay light.
 * @returns {string} Style block markup
 */
const _renderThemeStyles = (): string =>
  [
    "<style>",
    ":root{color-scheme:light dark;supported-color-schemes:light dark;}",
    "@media (prefers-color-scheme:dark){",
    `.ml-page{background-color:${DARK.PAGE} !important;}`,
    `.ml-hero-band{background-color:${DARK.HERO_BAND} !important;}`,
    `.ml-text{color:${DARK.TEXT} !important;}`,
    `.ml-muted{color:${DARK.MUTED} !important;}`,
    `.ml-eyebrow{color:${DARK.EYEBROW} !important;}`,
    `.ml-accent{color:${DARK.ACCENT} !important;}`,
    "}",
    "</style>",
  ].join("");

/**
 * Render the tinted hero band wrapping the logo mark, eyebrow, and heading.
 * @param {MailTemplateContent} content - Template copy
 * @returns {string} Hero band markup
 */
const _renderHeroBand = (content: MailTemplateContent): string =>
  [
    '<tr><td style="padding:32px 24px 0;">',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="ml-hero-band" style="background-color:${LIGHT.HERO_BAND};border-radius:16px;">`,
    '<tr><td align="center" style="padding:32px 24px 30px;">',
    `<img src="${_absoluteAssetUrl(LogoMark)}" width="${MARK_SIZE}" height="${MARK_SIZE}" alt="${MAIL_CONFIG.BRAND_NAME}" style="display:block;width:${MARK_SIZE}px;height:${MARK_SIZE}px;margin:0 auto;border:0;" />`,
    `<p class="ml-eyebrow" style="margin:18px 0 14px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${LIGHT.EYEBROW};">${content.eyebrow}</p>`,
    `<h1 class="ml-text" style="margin:0;font-family:${FONT};font-size:30px;font-weight:700;line-height:1.25;color:${LIGHT.TEXT};">${content.heading}<br /><em class="ml-accent" style="font-family:${SERIF};font-size:32px;font-style:italic;color:${LIGHT.ACCENT};">${content.accent}</em></h1>`,
    `<p class="ml-muted" style="margin:16px 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${LIGHT.MUTED};">${content.intro}</p>`,
    "</td></tr>",
    "</table>",
    "</td></tr>",
  ].join("");

/**
 * Render a free-text note block.
 * @param {string} note - Escaped note text
 * @returns {string} Note markup
 */
const _renderNote = (note: string): string =>
  [
    '<tr><td align="center" style="padding:24px 24px 0;">',
    `<p class="ml-muted" style="margin:0;font-family:${FONT};font-size:13px;line-height:1.7;color:${LIGHT.MUTED};">${note}</p>`,
    "</td></tr>",
  ].join("");

/**
 * Escape the compose body and convert newlines to line breaks.
 * @param {string} body - Raw compose body
 * @returns {string} Escaped body with line breaks
 */
const _escapeBody = (body: string): string => escapeMailHtml(body.trim()).replace(/\r?\n/g, "<br />");

/**
 * Build the HTML mail body for the selected template.
 * @param {string} body - Plain text mail body entered by the user
 * @param {MailTemplate} template - Selected mail template
 * @returns {string} HTML mail body
 */
export const buildMailHtmlTemplate = (body: string, template: MailTemplate = MAIL_CONFIG.DEFAULT_TEMPLATE): string => {
  const content = MAIL_CONFIG.TEMPLATE_CONTENT[template];
  const note = _escapeBody(body) || escapeMailHtml(content.note);

  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="color-scheme" content="light dark" /><meta name="supported-color-schemes" content="light dark" />',
    _renderThemeStyles(),
    "</head>",
    `<body class="ml-page" style="margin:0;padding:0;background-color:${LIGHT.PAGE};">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="ml-page" style="background-color:${LIGHT.PAGE};">`,
    '<tr><td align="center">',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${CONTENT_WIDTH}px;font-family:${FONT};">`,
    _renderHeroBand(content),
    _renderNote(note),
    _renderNote(escapeMailHtml(content.closing)),
    '<tr><td style="padding:0 0 32px;"></td></tr>',
    "</table>",
    "</td></tr>",
    "</table>",
    "</body></html>",
  ].join("");
};
