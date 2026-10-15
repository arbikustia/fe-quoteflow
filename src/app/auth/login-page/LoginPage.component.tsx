import type { ReactElement } from 'react';

import SoniclineLogo from '@/assets/Sonicline.png';

import type { LoginPageProps } from './LoginPage.type';

/**
 * Render 2D rental equipment vector illustration with smooth CSS animations
 * @param {boolean} [isCompact] - render compact illustration for mobile
 * @returns {ReactElement} 2D illustration SVG
 */
const _renderRentalIllustration = (isCompact = false): ReactElement => (
  <div className={`relative w-full ${isCompact ? 'max-w-[280px] py-1' : 'max-w-[480px] xl:max-w-[520px] my-auto py-4'} mx-auto flex items-center justify-center`}>
    <style>{`
      @keyframes gearFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes tallyPulse {
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 3px #ef4444); }
        50% { opacity: 0.25; filter: none; }
      }
      @keyframes beamShimmer {
        0%, 100% { opacity: 0.10; }
        50% { opacity: 0.22; }
      }
      .gear-float { animation: gearFloat 4.5s ease-in-out infinite; }
      .tally-pulse { animation: tallyPulse 1.8s ease-in-out infinite; }
      .beam-shimmer { animation: beamShimmer 3.5s ease-in-out infinite; }
    `}</style>

    {/* Background ambient shape behind 2D illustration */}
    <div className={`absolute ${isCompact ? 'w-48 h-48' : 'w-80 h-80'} rounded-full bg-gradient-to-tr from-[#3550D7]/15 to-[#FF6E02]/10 blur-3xl pointer-events-none`} />

    {/* 2D Vector Illustration Canvas */}
    <svg
      viewBox="0 0 520 300"
      className="w-full h-auto drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground shadows and perspective grid */}
      <ellipse cx="250" cy="272" rx="195" ry="12" fill="#E2E8F0" />
      <g stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" opacity="0.65">
        <line x1="35" y1="238" x2="485" y2="238" />
        <line x1="65" y1="264" x2="455" y2="264" />
        <line x1="105" y1="288" x2="415" y2="288" />
        <line x1="105" y1="238" x2="150" y2="288" />
        <line x1="415" y1="238" x2="370" y2="288" />
      </g>

      {/* Rental camera */}
      <g className="gear-float" transform="translate(44, 96)">
        <rect x="26" y="36" width="94" height="64" rx="9" fill="#0F172A" />
        <rect x="36" y="46" width="70" height="44" rx="5" fill="#334155" />
        <circle cx="20" cy="68" r="23" fill="#1E293B" stroke="#3550D7" strokeWidth="4" />
        <circle cx="20" cy="68" r="13" fill="#38BDF8" opacity="0.75" />
        <path d="M 44 36 V 20 Q 44 15 50 15 H 102 Q 108 15 108 20 V 36" stroke="#475569" strokeWidth="6" fill="none" />
        <rect x="48" y="56" width="30" height="21" rx="2" fill="#38BDF8" opacity="0.8" />
        <circle cx="108" cy="48" r="4" fill="#EF4444" className="tally-pulse" />
        <rect x="25" y="101" width="105" height="8" rx="3" fill="#64748B" />
      </g>

      {/* Rental speaker */}
      <g transform="translate(48, 204)">
        <rect width="72" height="60" rx="7" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        <rect x="9" y="8" width="54" height="43" rx="4" fill="#1E293B" />
        <circle cx="36" cy="22" r="8" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="36" cy="42" r="12" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="36" cy="42" r="5" fill="#0F172A" />
        <rect x="30" y="-7" width="12" height="8" rx="2" fill="#475569" />
        <rect x="10" y="28" width="4" height="8" rx="2" fill="#FF6E02" />
      </g>

      {/* Rental projector */}
      <g transform="translate(196, 190)">
        <path d="M 15 20 Q 15 8 27 8 H 91 Q 103 8 103 20 V 61 H 15 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
        <path d="M 15 20 H 103" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="78" cy="37" r="15" fill="#1E293B" stroke="#3550D7" strokeWidth="3" />
        <circle cx="78" cy="37" r="7" fill="#38BDF8" opacity="0.8" />
        <rect x="27" y="31" width="28" height="12" rx="3" fill="#E2E8F0" />
        <circle cx="33" cy="62" r="4" fill="#475569" />
        <circle cx="89" cy="62" r="4" fill="#475569" />
        <path d="M 18 30 L -18 15 L -18 50 Z" fill="#38BDF8" opacity="0.12" className="beam-shimmer" />
      </g>

      {/* Item cards and status UI */}
      <g transform="translate(274, 22)">
        <rect width="202" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="12" y="13" width="42" height="42" rx="8" fill="#EEF2FF" />
        <rect x="21" y="25" width="24" height="16" rx="3" fill="#3550D7" />
        <circle cx="33" cy="33" r="5" fill="#38BDF8" />
        <text x="66" y="29" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">Kamera Pro</text>
        <text x="66" y="45" fill="#64748B" fontSize="10" fontFamily="sans-serif">12 Jun • 2 unit</text>
        <rect x="66" y="57" width="62" height="19" rx="9.5" fill="#ECFDF5" />
        <circle cx="76" cy="66.5" r="3" fill="#10B981" />
        <text x="84" y="70" fill="#047857" fontSize="9" fontWeight="600" fontFamily="sans-serif">Tersedia</text>
        <rect x="136" y="57" width="52" height="19" rx="9.5" fill="#FFF7ED" />
        <text x="144" y="70" fill="#C2410C" fontSize="9" fontWeight="600" fontFamily="sans-serif">2 unit</text>
      </g>

      <g transform="translate(326, 126)">
        <rect width="150" height="58" rx="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="10" y="10" width="34" height="34" rx="7" fill="#FFF7ED" />
        <path d="M 18 29 H 36 L 33 20 H 21 Z" fill="#FF6E02" />
        <text x="55" y="24" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="sans-serif">Speaker Aktif</text>
        <text x="55" y="39" fill="#64748B" fontSize="9" fontFamily="sans-serif">Kembali 14 Jun</text>
        <circle cx="134" cy="18" r="5" fill="#3550D7" />
      </g>

      {/* Rental flow */}
      <g transform="translate(136, 136)">
        <circle cx="0" cy="0" r="9" fill="#3550D7" />
        <path d="M -4 0 L 0 4 L 5 -4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <line x1="10" y1="0" x2="48" y2="0" stroke="#3550D7" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="58" cy="0" r="9" fill="#FF6E02" />
        <rect x="54" y="-4" width="8" height="8" rx="1" fill="#FFFFFF" />
        <line x1="68" y1="0" x2="106" y2="0" stroke="#FF6E02" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="116" cy="0" r="9" fill="#10B981" />
        <path d="M 112 0 L 116 4 L 121 -4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <text x="-17" y="23" fill="#64748B" fontSize="9" fontFamily="sans-serif">Pesan</text>
        <text x="38" y="23" fill="#64748B" fontSize="9" fontFamily="sans-serif">Sewa</text>
        <text x="96" y="23" fill="#64748B" fontSize="9" fontFamily="sans-serif">Kembali</text>
      </g>
    </svg>
  </div>
);

/**
 * Render visual presentation panel on the right side
 * @returns {ReactElement} visual panel node
 */
const _renderVisualPanel = (): ReactElement => (
  <div className="hidden lg:flex lg:w-1/2 h-full relative bg-[#F8FAFC] flex-col justify-between p-10 xl:p-14 overflow-hidden select-none border-l border-slate-200/90">
    {/* Subtle technical background grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

    {/* Center 2D Visual */}
    <div className="relative z-10 my-auto w-full">
      {_renderRentalIllustration()}
    </div>

    {/* Bottom Headline & Description */}
    <div className="relative z-10 space-y-2 pt-4">
      <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-[#0F172A]">
        Kelola rental lebih mudah, dari pemesanan hingga pengembalian.
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
        Pantau ketersediaan barang, transaksi, pelanggan, dan jadwal rental dalam satu sistem terintegrasi.
      </p>
    </div>
  </div>
);

/**
 * Render Login Page Component
 * @param {LoginPageProps} props - component props
 * @returns {ReactElement} component node
 */
export const LoginPageComponent = (props: LoginPageProps): ReactElement => {
  const {
    identifier,
    password,
    isPasswordVisible,
    isRemembered,
    onIdentifierChange,
    onPasswordChange,
    onTogglePasswordVisibility,
    onRememberedChange,
    onSubmit,
  } = props;

  return (
    <div className="login-page-viewport w-full flex items-center justify-center bg-[#0d0932] p-0 font-sans overflow-hidden">
      {/* Perspective grid background for outer page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main Container Card: Full height fit */}
      <div className="relative w-full h-full bg-[#f9fafb] shadow-2xl flex flex-col lg:flex-row overflow-hidden z-10">
        
        {/* Left Side: Form Login */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#f9fafb] overflow-y-auto">
          {/* Logo Section */}
          <div className="flex lg:justify-start w-full">
            <img
              src={SoniclineLogo}
              alt="Sonicline Logo"
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
            />
          </div>

          {/* Compact animated visual for mobile */}
          <div className="lg:hidden w-full max-w-[280px] sm:max-w-xs mx-auto mt-4 mb-2">
            {_renderRentalIllustration(true)}
          </div>

          {/* Form Content */}
          <div className="w-full max-w-md mx-auto my-auto py-4 sm:py-6 lg:py-8">
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] mb-2">
                Selamat datang kembali
              </h1>
              <p className="text-sm sm:text-base text-[#4b5563]">
                Masuk untuk mengelola bisnis rental Anda.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
              <div className="w-full">
                <label
                  htmlFor="identifier"
                  className="block text-sm font-semibold text-[#1f2937] mb-2 text-left"
                >
                  Email atau nama pengguna
                </label>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={onIdentifierChange}
                  placeholder="nama@sonicline.co.id"
                  className="w-full h-12 px-4 rounded-xl border border-[#d1d5db] bg-white text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3550D7] focus:outline-none focus:ring-2 focus:ring-[#3550D7]/25 transition-all"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1f2937] mb-2 text-left"
                >
                  Kata sandi
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="••••••••"
                    className="login-password-input w-full h-12 px-4 pr-12 rounded-xl border border-[#d1d5db] bg-white text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3550D7] focus:outline-none focus:ring-2 focus:ring-[#3550D7]/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={onTogglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827] focus:outline-none p-1.5 cursor-pointer"
                    aria-label={isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {isPasswordVisible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" x2="23" y1="1" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 w-full">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#4b5563] select-none">
                  <input
                    type="checkbox"
                    checked={isRemembered}
                    onChange={onRememberedChange}
                    className="h-4 w-4 rounded border-[#d1d5db] text-[#3550D7] focus:ring-[#3550D7]/30 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-[#3550D7] hover:text-[#2D43B8] transition-colors"
                >
                  Lupa kata sandi?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#3550D7] hover:bg-[#2D43B8] active:bg-[#293A91] text-white text-base font-semibold shadow-md transition-all flex items-center justify-center mt-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3550D7]"
              >
                Masuk
              </button>
            </form>
          </div>

          {/* Footer bottom */}
          <div className="text-xs text-[#9ca3af] text-center lg:text-left mt-4">
            © 2026 PT Sonicline Multimedia. Hak cipta dilindungi.
          </div>
        </div>

        {/* Right Side: 2D Rental Visual Presentation */}
        {_renderVisualPanel()}

      </div>
    </div>
  );
};
