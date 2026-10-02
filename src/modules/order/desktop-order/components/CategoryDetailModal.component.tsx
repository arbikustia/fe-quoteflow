import * as React from "react";
import { FiLayers,FiX } from "react-icons/fi";

import type { CategoryDetailModalProps } from "../DesktopOrder.type";

/**
 * Category Detail Content Component
 * @param {object} props - props
 * @param {string[]} props.categories - categories list
 * @returns {React.ReactElement} content element
 */
const CategoryDetailContent = ({ categories }: { categories: string[] }): React.ReactElement => (
  <div className="flex-1 overflow-y-auto p-6 bg-brand-white">
    <div className="flex flex-col gap-2">
      {categories.length === 0 ? (
        <div className="text-center py-8 text-brand-text-medium text-sm">
          No categories selected.
        </div>
      ) : (
        categories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-brand-gray-light hover:border-brand-blue-light hover:bg-brand-blue-light/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-brand-gray-light text-brand-text-medium flex items-center justify-center text-xs font-medium">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-brand-text-dark">{cat}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

/**
 * Category Detail Modal Header Component
 * @param {{name: string, onClose: () => void}} props - props
 * @returns {React.ReactElement} header element
 */
const CategoryDetailModalHeader = ({ name, onClose }: { name: string, onClose: () => void }): React.ReactElement => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light bg-brand-gray-light/50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue">
        <FiLayers className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-brand-text-dark">Selected Categories</h2>
        <p className="text-xs text-brand-text-medium mt-0.5">{name}</p>
      </div>
    </div>
    <button 
      onClick={onClose}
      className="p-2 text-brand-text-medium hover:text-brand-text-medium hover:bg-brand-gray-light rounded-lg transition-colors cursor-pointer"
    >
      <FiX className="w-5 h-5" />
    </button>
  </div>
);

/**
 * Category Detail Modal Component
 * @param {CategoryDetailModalProps} props - component props
 * @returns {React.ReactElement | null} modal element
 */
export const CategoryDetailModal = ({ isOpen, onClose, quote }: CategoryDetailModalProps): React.ReactElement | null => {
  if (!isOpen || !quote) return null;

  const categories = quote.category.split(',').map(c => c.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-brand-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <CategoryDetailModalHeader name={quote.name} onClose={onClose} />
        <CategoryDetailContent categories={categories} />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-gray-light bg-brand-gray-light flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-colors text-sm cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
