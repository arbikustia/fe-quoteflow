import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import GlobalHeader from "./GlobalHeader";

export default function MobileLayout({ children }: { readonly children?: React.ReactNode }): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    {
      id: "/home",
      label: "Home",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    {
      id: "/order",
      label: "Order",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
    },
    {
      id: "/return-mobile",
      label: "Return",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
    },
    {
      id: "/master-main-mobile",
      label: "Master",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    },
    {
      id: "/report-main-mobile",
      label: "Report",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fb] absolute inset-0">
      <GlobalHeader />
      <div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden pb-10">
        {children || <Outlet />}
      </div>
      <div className="fixed bottom-6 left-6 right-6 bg-white rounded-[2rem] px-2 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50">
        {tabs.map((tab) => {
          const isActive = path.startsWith(tab.id) && tab.id.startsWith("/");
          return (
            <button 
              key={tab.id}
              onClick={() => {
                if (tab.id.startsWith("/")) navigate(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-[#2b2d30]' : 'text-gray-400 hover:text-gray-900'} w-14 h-14`}
            >
              <div 
                className={`absolute top-0 bg-[#2b2d30] rounded-full transition-all duration-300 origin-center shadow-lg ${isActive ? 'scale-100 opacity-100 transform -translate-y-4 w-12 h-12' : 'scale-0 opacity-0 w-12 h-12'}`}
              ></div>
              <div className={`relative z-10 transition-transform duration-300 mb-3 ${isActive ? '-translate-y-4 scale-110 text-white' : 'scale-100'}`}>
                {tab.icon}
              </div>
              <span className={`absolute bottom-0.5 text-[11px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 text-[#2b2d30]' : 'opacity-100'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

