import * as React from "react";

import type { RecentQuote } from "../DesktopDashboard.type";

/**
 * Render Recent Quotes Table
 * @param {object} props - component props
 * @param {RecentQuote[]} props.quotes - quotes array
 * @returns {React.ReactElement} table component
 */
export const RecentQuotesTable = ({ quotes }: { readonly quotes: RecentQuote[] }): React.ReactElement => (
  <div className="lg:col-span-2 bg-brand-white/90 backdrop-blur-xl border border-brand-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
    <div className="p-6 border-b border-brand-gray-light flex justify-between items-center">
      <h2 className="text-lg font-bold text-brand-text-dark">Recent Quotes</h2>
      <button className="text-sm font-bold text-brand-blue hover:text-brand-blue-dark transition-colors">View All</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-brand-gray-light/50">
            <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">Client</th>
            <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-light">
          {quotes.map((row, i) => (
            <tr key={i} className="hover:bg-brand-gray-light/50 transition-colors">
              <td className="px-6 py-4 font-bold text-brand-text-dark">{row.client}</td>
              <td className="px-6 py-4 font-medium text-brand-text-dark">{row.amount}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.bg} ${row.color}`}>{row.status}</span>
              </td>
              <td className="px-6 py-4 text-sm text-brand-text-medium">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
