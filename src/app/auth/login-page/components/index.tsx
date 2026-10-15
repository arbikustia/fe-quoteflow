import type { ChangeEvent, ReactElement, SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SoniclineLogo from "../../../../assets/Sonicline.png";

/**
 * Render visual panel showing branded graphic and quotation preview.
 * @returns {ReactElement} visual panel node
 */
const _renderVisualPanel = (): ReactElement => (
  <div className="hidden lg:flex lg:w-1/2 lg:h-full relative bg-[#0B1324] flex-col justify-between p-12 xl:p-16 overflow-hidden select-none border-l border-border-default">
    {/* Decorative lighting */}
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#3550D7]/30 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FF6E02]/20 rounded-full blur-3xl pointer-events-none" />

    {/* Top badge */}
    <div className="relative z-10 flex items-center justify-between">
      <span className="inline-flex items-center gap-2 rounded-full border border-action-primary/40 bg-action-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#A5B4FC]">
        <span className="h-2 w-2 rounded-full bg-action-primary animate-pulse" />
        QuoteFlow Platform
      </span>
      <span className="text-xs text-text-tertiary">v1.0 Enterprise</span>
    </div>

    {/* Center visual graphic: Quotation preview card */}
    <div className="relative z-10 my-auto py-8">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Quotation</p>
            <p className="text-base font-bold text-white tracking-tight">QT-2026-0889</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            Approved
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Customer</span>
            <span className="font-semibold text-white">PT Nusantara Citra Media</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Rental Period</span>
            <span className="font-medium text-slate-200">24 Oct - 28 Oct 2026</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Equipment</span>
            <span className="font-medium text-slate-200">LED Videotron P3.9 + Audio Rig</span>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-4 flex items-center justify-between border border-white/5">
          <span className="text-xs font-medium text-slate-400">Estimated Total</span>
          <span className="text-lg font-bold text-white tracking-tight">Rp 48.500.000</span>
        </div>
      </div>
    </div>

    {/* Bottom summary text */}
    <div className="relative z-10">
      <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
        Rental & Quotation Workflow Simplified
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
        Accelerate quotation creation, monitor multi-tier approvals, and oversee inventory dispatch for Sonicline Multimedia operations.
      </p>
    </div>
  </div>
);

/**
 * Render Login Page
 * @returns {ReactElement} node
 */
export default function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  /**
   * Handle login form submit
   * @param {SyntheticEvent} event - form event
   * @returns {void}
   */
  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    navigate("/home");
  };

  return (
    <div className="h-full min-h-full w-full flex flex-col lg:flex-row bg-background-page font-sans text-text-primary overflow-y-auto lg:overflow-hidden">
      {/* Form Side */}
      <div className="w-full min-h-full lg:w-1/2 lg:h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-background-surface z-10">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <img
            src={SoniclineLogo}
            alt="Sonicline Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
              Sign In to QuoteFlow
            </h1>
            <p className="text-sm text-text-secondary">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="name@sonicline.co.id"
                className="w-full h-11 px-4 rounded-xl border border-border-default bg-background-surface text-base text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl border border-border-default bg-background-surface text-base text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-default text-action-primary focus:ring-focus-ring/30"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-action-primary hover:text-action-primary-hover transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-action-primary hover:bg-action-primary-hover active:bg-action-primary-pressed text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center mt-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-xs text-text-tertiary">
          © 2026 PT Sonicline Multimedia. All rights reserved.
        </div>
      </div>

      {/* Visual Panel Side */}
      {_renderVisualPanel()}
    </div>
  );
}
