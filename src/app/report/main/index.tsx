import * as React from "react";
import { useNavigate } from "react-router-dom";

import ResponsiveLayout from "../../shared/ResponsiveLayout";
import { Icons } from "../../../components/Icons";

/**
 * Mobile Report Main View Component
 * @returns {React.ReactElement} node
 */
export default function MobileReportMain(): React.ReactElement {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Order",
      description: "View and manage all completed orders",
      icon: <Icons.Quotes />,
      path: "/report",
      bgColor: "bg-[#daeaf3]", // pastel blue
      iconColor: "text-[#3b82f6]",
    }
  ];

  return (
    <ResponsiveLayout>
      <div className="flex-1 w-full min-h-full bg-background-page font-sans pb-32">
      
      
      <div className="px-6 mt-6">
        <h2 className="text-[32px] font-normal tracking-wide text-text-primary mb-6">Overview</h2>
        <div className="flex flex-col gap-5">
          {cards.map((card, index) => (
            <div 
              key={index} 
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} rounded-[2rem] p-6 flex flex-col shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer`}
            >
              <div className="flex justify-between items-start relative z-10 mb-4">
                <div className={`w-14 h-14 bg-background-surface rounded-full flex items-center justify-center shrink-0 shadow-sm ${card.iconColor}`}>
                  {card.icon}
                </div>
                <div className="w-10 h-10 bg-background-surface/50 rounded-full flex items-center justify-center shrink-0 text-text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <h2 className="text-[24px] font-medium text-text-primary leading-none mb-2">{card.title}</h2>
                <p className="text-[14px] text-text-secondary leading-snug pr-4">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
