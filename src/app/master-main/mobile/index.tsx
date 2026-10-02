import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Icons } from "../../components/Icons";

/**
 * Mobile Header Component
 * @returns {React.ReactElement} node
 */
const MobileHeader = (): React.ReactElement => (
  <div className="px-6 pt-12 pb-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <h1 className="text-[22px] font-medium text-gray-900 leading-tight">Master Data</h1>
    </div>
  </div>
);

/**
 * Mobile Master Main View Component
 * @returns {React.ReactElement} node
 */
export default function MobileMasterMain(): React.ReactElement {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Master User",
      description: "Manage system users and their roles in the application",
      icon: <Icons.Customers />,
      path: "/master-user",
      bgColor: "bg-[#daeaf3]", // pastel blue
      iconColor: "text-[#3b82f6]",
    },
    {
      title: "Master Category",
      description: "Manage product and item categories used for quotes",
      icon: <Icons.Dashboard />,
      path: "/master-category",
      bgColor: "bg-[#e7dff2]", // pastel purple
      iconColor: "text-[#8b5cf6]",
    },
    {
      title: "Master Item",
      description: "Manage all items and inventory data in the system",
      icon: <Icons.Database />,
      path: "/master-item",
      bgColor: "bg-[#f4e482]", // pastel yellow
      iconColor: "text-[#eab308]",
    },
  ];

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      
      <div className="px-6 mt-6">
        <h2 className="text-[32px] font-normal tracking-wide text-gray-900 mb-6">Overview</h2>
        <div className="flex flex-col gap-5">
          {cards.map((card, index) => (
            <div 
              key={index} 
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} rounded-[2rem] p-6 flex flex-col shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer`}
            >
              <div className="flex justify-between items-start relative z-10 mb-4">
                <div className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm ${card.iconColor}`}>
                  {card.icon}
                </div>
                <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center shrink-0 text-gray-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <h2 className="text-[24px] font-medium text-gray-900 leading-none mb-2">{card.title}</h2>
                <p className="text-[14px] text-gray-700 leading-snug pr-4">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
