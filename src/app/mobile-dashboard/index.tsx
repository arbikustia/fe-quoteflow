import * as React from "react";
import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../../modules/order-page/OrderPage.type";

/**
 * Mobile Header Component
 * @returns {React.ReactElement} node
 */
const MobileHeader = (): React.ReactElement => (
  <div className="px-6 pt-12 pb-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-gray-light shrink-0">
        <img src="https://ui-avatars.com/api/?name=Stevy+Ditolla&background=random" alt="Avatar" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-[22px] font-medium text-gray-900 leading-tight">Hello, Superadmin!</h1>
    </div>
    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center relative bg-white shrink-0">
      <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
    </div>
  </div>
);

/**
 * Main Order Bar Chart
 * @returns {React.ReactElement} node
 */
const MainOrderChart = (): React.ReactElement => (
  <div className="mt-4 flex flex-col">
    <div className="flex items-end justify-between h-32 gap-2 px-1">
      <div className="w-full bg-[#c5d9ad] rounded-full h-[40%]"></div>
      <div className="w-full bg-[#c5d9ad] rounded-full h-[55%]"></div>
      <div className="w-full bg-[#c5d9ad] rounded-full h-[75%]"></div>
      <div className="w-full bg-[#c5d9ad] rounded-full h-[35%]"></div>
      <div className="w-full bg-[#2b2d30] rounded-full h-[100%] shadow-lg"></div>
      <div className="w-full bg-[#c5d9ad] rounded-full h-[50%]"></div>
      <div className="w-full bg-[#c5d9ad] opacity-60 rounded-full h-[25%]"></div>
      <div className="w-full bg-[#c5d9ad] opacity-60 rounded-full h-[20%]"></div>
      <div className="w-full bg-[#c5d9ad] opacity-60 rounded-full h-[30%]"></div>
    </div>
    <div className="flex justify-between mt-4 px-1">
      <span className="text-[11px] text-gray-600 font-medium">6am</span>
      <span className="text-[11px] text-gray-600 font-medium">7am</span>
      <span className="text-[11px] text-gray-600 font-medium">8am</span>
      <span className="text-[11px] text-gray-600 font-medium">9am</span>
      <span className="text-[11px] text-gray-900 font-bold">10am</span>
      <span className="text-[11px] text-gray-600 font-medium">11am</span>
      <span className="text-[11px] text-gray-500 font-medium">12pm</span>
      <span className="text-[11px] text-gray-500 font-medium">1pm</span>
      <span className="text-[11px] text-gray-500 font-medium">2pm</span>
    </div>
  </div>
);

/**
 * Main Order Card
 * @param {{ readonly order: QuoteData }} props - props
 * @returns {React.ReactElement} node
 */
const MainOrderCard = ({ order }: { readonly order: QuoteData }): React.ReactElement => (
  <div className="bg-[#d7e6c3] rounded-4xl p-2 mb-5 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <div className="flex gap-2 items-center">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm shrink-0">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div>
          <h2 className="text-[26px] font-medium text-gray-900 leading-none mb-1.5">{order.id}</h2>
          <p className="text-[14px] text-gray-600 leading-snug">Last update 3 days ago</p>
        </div>
      </div>
    </div>
    <MainOrderChart />
  </div>
);

/**
 * Confirmed Orders Card
 * @param {{ readonly count: number }} props - props
 * @returns {React.ReactElement} node
 */
const ConfirmedCard = ({ count }: { readonly count: number }): React.ReactElement => (
  <div className="bg-[#daeaf3] rounded-[2rem] p-2 pb-0 flex flex-col aspect-square shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 mb-8">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 text-gray-700 shadow-sm">
         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
      </div>
      <div>
        <h2 className="text-[26px] leading-none font-medium text-gray-900">{count} <span className="font-medium">Confirmed</span></h2>
      </div>
    </div>
    <div className="flex-1 w-full flex items-end p-6">
      <svg className="w-full h-full transform origin-bottom scale-[1.15]" viewBox="0 0 100 60" preserveAspectRatio="none">
        <rect x="0" y="15" width="4" height="45" rx="2" fill="#1c1c1c" />
        <rect x="15" y="30" width="4" height="30" rx="2" fill="#1c1c1c" />
        <rect x="30" y="5" width="4" height="55" rx="2" fill="#1c1c1c" />
        <rect x="45" y="20" width="4" height="40" rx="2" fill="#1c1c1c" />
        <rect x="60" y="35" width="4" height="25" rx="2" fill="#1c1c1c" />
        <rect x="75" y="25" width="4" height="35" rx="2" fill="#aab8c2" />
        <rect x="90" y="35" width="4" height="25" rx="2" fill="#aab8c2" />
      </svg>
    </div>
  </div>
);

/**
 * Pending Orders Card
 * @param {{ readonly count: number }} props - props
 * @returns {React.ReactElement} node
 */
const PendingCard = ({ count }: { readonly count: number }): React.ReactElement => (
  <div className="bg-[#e7dff2] rounded-[2rem] p-2 flex flex-col aspect-square shadow-sm overflow-hidden relative">
    <div className="flex items-center gap-2 mb-2 relative z-10">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 text-gray-700 shadow-sm">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
      <div>
        <h2 className="text-[26px] leading-none font-medium text-gray-900">{count} <span className="font-medium">Pending</span></h2>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[70%] w-full pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b7a6d8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#b7a6d8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,45 C20,35 30,55 50,45 C60,40 70,10 80,25 C90,40 95,45 100,40 L100,65 L0,65 Z" fill="url(#purpleGrad)" />
        <path d="M0,45 C20,35 30,55 50,45 C60,40 70,10 80,25 C90,40 95,45 100,40" fill="none" stroke="#907cb5" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="25" r="3.5" fill="#fff" stroke="#907cb5" strokeWidth="2.5" />
      </svg>
    </div>
  </div>
);

/**
 * Client Card
 * @param {{ readonly order: QuoteData }} props - props
 * @returns {React.ReactElement} node
 */
const ClientCard = ({ order }: { readonly order: QuoteData }): React.ReactElement => (
  <div className="bg-[#f4e482] rounded-full p-4 pl-5 flex items-center justify-between shadow-sm mb-6">
    <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-white shrink-0">
        <img src="https://ui-avatars.com/api/?name=Bertrand+Rabello&background=random" alt="Client" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 text-[16px] truncate">{order.name}</h4>
        <p className="text-[13px] text-gray-700 mt-0.5">Client</p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm hover:scale-105 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
      <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm hover:scale-105 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </div>
  </div>
);



/**
 * Mobile Dashboard View Component
 * @returns {React.ReactElement} node
 */
export default function MobileDashboard(): React.ReactElement {
  const latestOrder = MOCK_QUOTES[0];
  const pendingCount = MOCK_QUOTES.filter((q) => q.status === "Pending Payment").length;
  const confirmedCount = MOCK_QUOTES.filter((q) => q.status === "Confirmed").length;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      <MobileHeader />
      <div className="px-6">
        <h2 className="text-[32px] font-normal tracking-wide text-gray-900 mb-6">Order Data</h2>
        <MainOrderCard order={latestOrder} />
        <div className="grid grid-cols-2 gap-5 mb-5">
          <ConfirmedCard count={confirmedCount} />
          <PendingCard count={pendingCount} />
        </div>
        <ClientCard order={latestOrder} />
      </div>
    </div>
  );
}
