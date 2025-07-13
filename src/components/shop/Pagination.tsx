import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const items = [];
    const displayPages = 5; // Number of page buttons to show
    const ellipsis = (
      <span className="px-4 py-2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="4" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
        </svg>
      </span>
    );
    
    let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
    let endPage = Math.min(totalPages, startPage + displayPages - 1);
    
    if (endPage - startPage + 1 < displayPages) {
      startPage = Math.max(1, endPage - displayPages + 1);
    }
    
    // Add first page
    if (startPage > 1) {
      items.push(
        <button
          key="first"
          onClick={() => onPageChange(1)}
          className="min-w-[40px] h-10 flex items-center justify-center px-4 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium"
        >
          1
        </button>
      );
      
      // Add ellipsis if needed
      if (startPage > 2) {
        items.push(<span key="ellipsis-start">{ellipsis}</span>);
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`
            min-w-[40px] h-10 flex items-center justify-center px-4 rounded-lg font-medium
            ${currentPage === i
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
            transition-colors
          `}
        >
          {i}
        </button>
      );
    }
    
    // Add last page
    if (endPage < totalPages) {
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(<span key="ellipsis-end">{ellipsis}</span>);
      }
      
      items.push(
        <button
          key="last"
          onClick={() => onPageChange(totalPages)}
          className="min-w-[40px] h-10 flex items-center justify-center px-4 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium"
        >
          {totalPages}
        </button>
      );
    }
    
    return items;
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-1 px-4 h-10 rounded-lg font-medium
            ${currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
            transition-colors
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {renderPaginationItems()}
        </div>
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`
            flex items-center gap-1 px-4 h-10 rounded-lg font-medium
            ${currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
            transition-colors
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Page info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
