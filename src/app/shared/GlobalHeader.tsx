import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "../../assets/Sonicline.png";

export default function GlobalHeader(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Determine if the create button should be shown and its endpoint
  let createEndpoint = "";
  if (path === "/order") createEndpoint = "/order/create";
  else if (path === "/master-user-mobile") createEndpoint = "/master-user-mobile-create";
  else if (path === "/master-category-mobile") createEndpoint = "/master-category-mobile-create";
  else if (path === "/master-item-mobile") createEndpoint = "/master-item-mobile-create";

  return (
    <div className="px-6 pt-5 pb-4 flex items-center justify-between bg-[#f8f9fb]">
      <div className="flex items-center gap-4">
        <div className="w-52 h-14">
          <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {createEndpoint && (
          <button 
            onClick={() => navigate(createEndpoint)}
            className="bg-[#212330] text-white rounded-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="font-medium text-[14px]">Create</span>
          </button>
        )}
        {path === "/home" && (
          <button
            onClick={() => navigate("/login")}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm shrink-0"
            aria-label="Logout"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
