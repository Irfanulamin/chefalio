"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
};

export const PaginationSection = ({
  totalPages,
  currentPage,
  setPage,
  scrollTargetRef,
}: Props) => {
  const handlePageChange = (page: number) => {
    setPage(page);
    scrollTargetRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPages = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const isFirst = i === 1;
      const isLast = i === totalPages;
      const isNearCurrent = Math.abs(i - currentPage) <= 1;

      if (isFirst || isLast || isNearCurrent) {
        pages.push(i);
      } else {
        const prev = pages[pages.length - 1];
        if (prev !== "ellipsis") {
          pages.push("ellipsis");
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent className="flex gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage <= 1}
              className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>

          {getPages().map((item, idx) => {
            if (item === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {totalPages > 1 && (
        <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
};
