import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MobileLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    {
      id: "/home-mobile",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    {
      id: "/order-mobile",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
    },
    {
      id: "/return-mobile",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
    },
    {
      id: "grid",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    },
    {
      id: "settings",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fb] absolute inset-0">
      <div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden pb-10">
        <Outlet />
      </div>
      <div className="fixed bottom-6 left-6 right-6 bg-white rounded-full px-5 py-4 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50">
        {tabs.map((tab) => {
          const isActive = path.startsWith(tab.id) && tab.id.startsWith("/");
          return (
            <button 
              key={tab.id}
              onClick={() => {
                if (tab.id.startsWith("/")) navigate(tab.id);
              }}
              className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-900'} w-12 h-12`}
            >
              <div 
                className={`absolute inset-0 bg-[#2b2d30] rounded-full transition-all duration-300 origin-center shadow-lg ${isActive ? 'scale-100 opacity-100 transform -translate-y-3' : 'scale-0 opacity-0'}`}
              ></div>
              <div className={`relative z-10 transition-transform duration-300 ${isActive ? '-translate-y-3 scale-110' : 'scale-100'}`}>
                {tab.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
