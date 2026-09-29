import * as React from "react";

import { QuotesIcon, UsersIcon } from "./StatIcons";

/**
 * Render Quick Actions Widget
 * @param {object} props - component props
 * @param {Function} props.onNewOrder - handler
 * @param {Function} props.onReturn - handler
 * @returns {React.ReactElement} widget component
 */
export const QuickActions = ({ onNewOrder, onReturn }: { readonly onNewOrder: () => void; readonly onReturn: () => void }): React.ReactElement => {
  return (
    <div className="bg-brand-white/90 backdrop-blur-xl border border-brand-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-brand-text-dark mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button onClick={onNewOrder} className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-gray-light hover:border-brand-blue/30 hover:bg-brand-blue/5 group transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center">
                <QuotesIcon />
              </div>
              <span className="font-bold text-brand-text-dark group-hover:text-brand-blue transition-colors">New Order</span>
            </div>
            <span className="text-brand-text-medium">→</span>
          </button>
          <button onClick={onReturn} className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-gray-light hover:border-brand-orange/30 hover:bg-brand-orange/5 group transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">
                <UsersIcon />
              </div>
              <span className="font-bold text-brand-text-dark group-hover:text-brand-orange transition-colors">Return</span>
            </div>
            <span className="text-brand-text-medium">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
