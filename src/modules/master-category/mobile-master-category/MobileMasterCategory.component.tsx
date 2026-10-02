import * as React from "react";

import type {
  CategoryRowProps,
  MobileHeaderProps,
  MobileMasterCategoryProps,
} from "./MobileMasterCategory.type";

/**
 * Render Mobile Header Component
 * @param {MobileHeaderProps} props - component props
 * @returns {React.ReactElement} - mobile header element
 */
const _MobileHeader = ({ onNavigate }: MobileHeaderProps): React.ReactElement => {
  /**
   * Handle navigate to main
   * @returns {void} - void
   */
  const handleNavigateToMain = (): void => {
    onNavigate("/master-main");
  };

  /**
   * Handle navigate to create
   * @returns {void} - void
   */
  const handleNavigateToCreate = (): void => {
    onNavigate("/master-category-create");
  };

  return (
    <div className="px-6 pt-10 pb-2 flex items-center justify-between sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <button onClick={handleNavigateToMain} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h3 className="text-[18px] font-bold text-[#1a233a] leading-tight">Master Category</h3>
      </div>
      <button onClick={handleNavigateToCreate} className="w-10 h-10 rounded-full bg-[#1a233a] shadow-md flex items-center justify-center text-white shrink-0 hover:bg-black transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  );
};

/**
 * Render Category Row Component
 * @param {CategoryRowProps} props - component props
 * @returns {React.ReactElement} - category row element
 */
const _CategoryRow = ({ category, index, onNavigate }: CategoryRowProps): React.ReactElement => {
  /**
   * Handle row click
   * @returns {void} - void
   */
  const handleRowClick = (): void => {
    onNavigate(`/master-category-detail/${category.id}`);
  };

  return (
    <div onClick={handleRowClick} className="bg-white rounded-3xl px-5 py-4 mb-3 flex items-center shadow-[0_4px_15_rgba(0,0,0,0.02)] border border-gray-100 transition-transform hover:scale-[1.01] cursor-pointer">
      <div className="w-10 flex items-center justify-start text-gray-500 font-bold text-[14px]">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="font-bold text-[14px] text-gray-800 truncate pr-2">{category.categoryName}</span>
      </div>
      <div className="w-1/3 flex justify-end">
        <div className="rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-[#8b5cf6] bg-[#e7dff2]">
          CATEGORY
        </div>
      </div>
    </div>
  );
};

/**
 * Render Mobile Master Category List View Component
 * @param {MobileMasterCategoryProps} props - component props
 * @returns {React.ReactElement} - mobile master category component
 */
export const MobileMasterCategoryComponent = (props: MobileMasterCategoryProps): React.ReactElement => {
  const { categories, onNavigate } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-32 relative overflow-y-auto">
      <_MobileHeader onNavigate={onNavigate} />
      
      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-bold text-[#1a233a] mb-0.5">Category List</h2>
        <p className="text-[14px] text-gray-500 font-medium">Manage product categories.</p>
        
        <div className="flex items-center mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <div className="w-10">No</div>
          <div className="flex-1">Category Info</div>
          <div className="w-1/3 text-right pr-2">Type</div>
        </div>

        <div className="flex flex-col">
          {categories.map((category, index) => (
            <_CategoryRow key={category.id} category={category} index={index} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};
