

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSizeChange?: (size: number) => void;
  showPageSizeOptions?: boolean;
}

export const PaginationHeader = ({
  pageSize,
  totalCount,
  onPageSizeChange,
  showPageSizeOptions = true,
}: Pick<PaginationProps, "pageSize" | "totalCount" | "onPageSizeChange" | "showPageSizeOptions">) => {
  return (
    <div className="flex items-center gap-3 text-sm text-brand-text-medium">
      Showing
      {showPageSizeOptions && onPageSizeChange ? (
        <select 
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-brand-gray-light rounded px-2 py-1 bg-brand-white font-medium text-brand-text-dark focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      ) : (
        <span className="font-medium text-brand-text-dark">{pageSize}</span>
      )}
      of {totalCount} results
    </div>
  );
};

export const PaginationFooter = ({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
}: Pick<PaginationProps, "currentPage" | "totalPages" | "onPageChange" | "onNextPage" | "onPrevPage">) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 border-t border-brand-gray-light flex items-center justify-center gap-2 text-sm text-brand-text-medium font-medium">
      <button 
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-brand-text-medium hover:text-brand-text-dark hover:bg-brand-gray-light'}`}
      >
        {"<"}
      </button>
      
      {pages.map(page => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === page 
              ? 'bg-brand-blue text-brand-white font-bold' 
              : 'hover:bg-brand-gray-light text-brand-text-dark'
          }`}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-brand-text-medium hover:text-brand-text-dark hover:bg-brand-gray-light'}`}
      >
        {">"}
      </button>
    </div>
  );
};
