interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-4 pb-8">
      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;
        const isActive = currentPage === pageNum;

        return (
          <button
            key={i}
            onClick={() => onPageChange(pageNum)}
            className={`min-w-9 h-9 rounded-lg font-bold text-sm transition-all cursor-pointer shadow-sm 
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700 hover:bg-gray-50'
              }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}