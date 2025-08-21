import React from "react";
import { Pagination } from "@heroui/pagination";

interface DownlineTableBottomContentProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DownlineTableBottomContent: React.FC<
  DownlineTableBottomContentProps
> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={totalPages || 1}
        onChange={onPageChange}
      />
    </div>
  );
};
