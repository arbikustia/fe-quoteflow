import * as React from "react";

import { QuotesIcon, RevenueIcon, UsersIcon } from "./StatIcons";

/**
 * Render Stat Cards
 * @returns {React.ReactElement} stat cards
 */
const CARDS = [
  { title: "Total Revenue", val: "Rp 150.000.000", chg: "+12.5%", color: "brand-blue", icon: <RevenueIcon /> },
  { title: "Active Quotes", val: "12", chg: "+5.2%", color: "brand-orange", icon: <QuotesIcon /> },
  { title: "New Customers", val: "4", chg: "Stable", color: "brand-text-medium", bg: "bg-brand-gray-light", icon: <UsersIcon /> },
];

/**
 * Get card hover class
 * @param {string} color - color
 * @returns {string} - class
 */
const getHoverClass = (color: string): string => {
  if (color === "brand-blue") return "hover:shadow-[0_8px_30px_rgba(93,124,240,0.1)]";
  if (color === "brand-orange") return "hover:shadow-[0_8px_30px_rgba(240,165,93,0.1)]";
  return "hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]";
};

/**
 * Get badge bg class
 * @param {string} color - color
 * @param {string} [bg] - custom bg
 * @returns {string} - class
 */
const getBgClass = (color: string, bg?: string): string => bg || `bg-${color}-light`;

/**
 * Get badge text class
 * @param {string} color - color
 * @param {string} [bg] - custom bg
 * @returns {string} - class
 */
const getTextClass = (color: string, bg?: string): string => bg ? "" : `text-${color}-dark`;

/**
 * Render Stat Cards
 * @returns {React.ReactElement} stat cards
 */
export const StatCards = (): React.ReactElement => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {CARDS.map((c, i) => {
      const hoverCls = getHoverClass(c.color);
      const bgCls = getBgClass(c.color, c.bg);
      const textCls = getTextClass(c.color, c.bg);

      return (
        <div key={i} className={`bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow group ${hoverCls}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-brand-text-medium mb-1">{c.title}</p>
              <h3 className="text-3xl font-extrabold text-brand-text-dark">{c.val}</h3>
              <p className={`text-xs font-medium text-${c.color} mt-2 flex items-center gap-1`}>
                <span className={`${bgCls} ${textCls} px-1.5 py-0.5 rounded-md`}>{c.chg}</span> from last month
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${bgCls} text-${c.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {c.icon}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
